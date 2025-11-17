import prisma from '../../lib/prisma'
import { CompletionStatus, MilestoneStatus } from '@prisma/client'

/**
 * Check if there are 3 consecutive missed logs
 */
async function hasThreeConsecutiveMisses(habitId: string): Promise<boolean> {
  const recentLogs = await prisma.habitLogs.findMany({
    where: {
      habitId
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 3
  })

  if (recentLogs.length < 3) {
    return false
  }

  // Check if all 3 most recent logs are missed
  return recentLogs.every(log => log.completionStatus === CompletionStatus.missed)
}

/**
 * Check for habits with passed nextDueDate and create missed logs
 */
export async function checkAndCreateMissedHabits(): Promise<void> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of day

    // Find all active habits where nextDueDate has passed
    const habitsWithMissedDueDate = await prisma.habit.findMany({
      where: {
        isArchived: false,
        nextDueDate: {
          lt: today // Less than today (passed)
        }
      },
      include: {
        habitLogs: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1 // Get the most recent log
        }
      }
    })

    console.log(`Found ${habitsWithMissedDueDate.length} habits with passed due dates`)

    for (const habit of habitsWithMissedDueDate) {
      // Check if a log was already created today for this habit
      const mostRecentLog = habit.habitLogs[0]
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      
      // Skip if a log was already created today (either completed or missed)
      if (mostRecentLog && new Date(mostRecentLog.createdAt) >= todayStart) {
        continue
      }

      // Create missed log
      await prisma.habitLogs.create({
        data: {
          habitId: habit.id,
          userId: habit.userId,
          completionStatus: CompletionStatus.missed,
          value: 0,
          durationMinutes: null,
          notes: null,
          customFields: {}
        }
      })

      // Update habit statistics
      const updateData: any = {
        currentStreak: 0,
        totalMissed: { increment: 1 }
      }

      // Check for 3 consecutive misses and lock milestones
      const hasThreeMisses = await hasThreeConsecutiveMisses(habit.id)
      if (hasThreeMisses) {
        await prisma.habitMilestones.updateMany({
          where: {
            habitId: habit.id,
            status: { in: [MilestoneStatus.inProgress, MilestoneStatus.achieved] }
          },
          data: {
            status: MilestoneStatus.locked
          }
        })
      }

      await prisma.habit.update({
        where: { id: habit.id },
        data: updateData
      })

      console.log(`Created missed log for habit: ${habit.name} (${habit.id})`)
    }

    console.log('Finished checking for missed habits')
  } catch (error) {
    console.error('Error checking for missed habits:', error)
    throw error
  }
}

