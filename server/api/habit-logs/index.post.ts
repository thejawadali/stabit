import { serverSupabaseUser } from '#supabase/server'
import { CompletionStatus, MilestoneStatus } from '@prisma/client'
import prisma from '../../../lib/prisma'
import calculateNextDueDate from '../../utils/getNextDueDate'


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
      value,
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

    // Parse value (default to 0 if not provided)
    const logValue = value !== undefined && value !== null ? parseInt(String(value)) : 0

    // Determine completion status based on value vs currentTargetValue
    // If value is less than currentTargetValue, status is partial
    let completionStatus: CompletionStatus = 'completed'
    if (habit.currentTargetValue > 0 && logValue < habit.currentTargetValue) {
      completionStatus = 'partial'
    }

    // Calculate weeks since habit creation and update currentTargetValue if needed
    const now = new Date()
    const createdAt = new Date(habit.createdAt)
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    
    // Calculate new currentTargetValue based on weeks passed
    // Formula: initialValue + (weeksSinceCreation * difficultyRate)
    // But don't exceed goalValue
    const weeksSinceCreation = Math.floor(daysSinceCreation / 7)
    const calculatedTargetValue = habit.initialValue + (weeksSinceCreation * habit.difficultyRate)
    const newCurrentTargetValue = Math.min(calculatedTargetValue, habit.goalValue)

    // Create habit log
    const habitLog = await prisma.habitLogs.create({
      data: {
        habitId,
        userId: user.sub,
        completionStatus: completionStatus,
        value: logValue,
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

    const updateData: any = {}

    // Update currentTargetValue if it has changed
    if (newCurrentTargetValue !== habit.currentTargetValue) {
      updateData.currentTargetValue = newCurrentTargetValue
    }

    // Increment current streak for completed or partial status
    if (completionStatus === 'completed' || completionStatus === 'partial') {
      const newCurrentStreak = habit.currentStreak + 1
      updateData.currentStreak = newCurrentStreak
      
      if (newCurrentStreak > habit.longestStreak) {
        updateData.longestStreak = newCurrentStreak
      }
    }
    
    // Increment total completions for completed or partial status
    if (completionStatus === 'completed' || completionStatus === 'partial') {
      updateData.totalCompletions = { increment: 1 }
    }
    
    // Update next due date
    updateData.nextDueDate = calculateNextDueDate(habit.frequency)
    
    // Update milestones (pass the actual value)
    await updateMilestones(
      habitId, 
      logValue, 
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

