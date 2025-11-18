import prisma from '../../../lib/prisma'
import { serverSupabaseUser } from '#supabase/server'
import { Frequency, CompletionStatus, MilestoneStatus } from '@prisma/client'

/**
 * Calculate next due date based on habit frequency
 */
function calculateNextDueDate(frequency: Frequency, currentDate: Date = new Date()): Date {
  const nextDate = new Date(currentDate)
  
  switch (frequency) {
    case Frequency.daily:
      nextDate.setDate(nextDate.getDate() + 1)
      break
    case Frequency.weekly:
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case Frequency.monthly:
      nextDate.setMonth(nextDate.getMonth() + 1)
      break
    default:
      nextDate.setDate(nextDate.getDate() + 1)
  }
  
  return nextDate
}

/**
 * Update milestone progress and status
 */
async function updateMilestones(habitId: string, value: number, durationMinutes: number | null) {
  const milestones = await prisma.habitMilestones.findMany({
    where: {
      habitId,
      status: { in: [MilestoneStatus.locked, MilestoneStatus.inProgress] }
    }
  })

  for (const milestone of milestones) {
    let progressIncrement = 0

    // Calculate progress based on target metric
    if (milestone.targetMetric === 'sessions') {
      progressIncrement = 1
    } else if (milestone.targetMetric === 'minutes' || milestone.targetMetric === 'hours') {
      progressIncrement = durationMinutes ?? 0
      if (milestone.targetMetric === 'hours') {
        progressIncrement = progressIncrement / 60
      }
    } else {
      // For other metrics, use the value from the log
      progressIncrement = value
    }

    const newProgress = milestone.currentProgress + progressIncrement
    const isAchieved = newProgress >= milestone.targetValue

    // Update milestone - unlock if it was locked and progress starts
    const newStatus = isAchieved 
      ? MilestoneStatus.achieved 
      : (milestone.status === MilestoneStatus.locked && newProgress > 0)
        ? MilestoneStatus.inProgress
        : MilestoneStatus.inProgress

    await prisma.habitMilestones.update({
      where: { id: milestone.id },
      data: {
        currentProgress: newProgress,
        status: newStatus,
        achievedDate: isAchieved ? new Date() : milestone.achievedDate
      }
    })
  }
}

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const body = await readBody(event)

    const {
      habitId,
      durationMinutes,
      notes,
      customFields
    } = body

    // Validate required fields
    if (!habitId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'habitId is required'
      })
    }

    // Only allow completed status - missed logs are created by cron job
    const completionStatus = 'completed'

    // Check if habit exists and belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: user.sub,
        isArchived: false
      }
    })

    if (!habit) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Habit not found'
      })
    }

    // Create habit log
    const habitLog = await prisma.habitLogs.create({
      data: {
        habitId,
        userId: user.sub,
        completionStatus: completionStatus as CompletionStatus,
        value: 0, // Default value since quantity is removed
        durationMinutes: durationMinutes ? parseInt(String(durationMinutes)) : null,
        notes: notes?.trim() || null,
        customFields: customFields && Object.keys(customFields).length > 0 
          ? customFields 
          : null
      },
      include: {
        habit: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      }
    })

    // Update habit statistics - only for completed status
    const updateData: any = {}

    // Increment current streak
    const newCurrentStreak = habit.currentStreak + 1
    updateData.currentStreak = newCurrentStreak
    
    if (newCurrentStreak > habit.longestStreak) {
      updateData.longestStreak = newCurrentStreak
    }
    
    // Increment total completions
    updateData.totalCompletions = { increment: 1 }
    
    // Update next due date
    updateData.nextDueDate = calculateNextDueDate(habit.frequency)
    
    // Update milestones
    await updateMilestones(
      habitId, 
      0, 
      durationMinutes ? parseInt(String(durationMinutes)) : null
    )

    // Update habit
    await prisma.habit.update({
      where: { id: habitId },
      data: updateData
    })

    return {
      success: true,
      message: 'Habit log created successfully',
      data: habitLog
    }
  } catch (error: any) {
    console.error('Error creating habit log:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create habit log'
    })
  }
})

