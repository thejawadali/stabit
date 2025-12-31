import { CompletionStatus } from '@prisma/client'
import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'


export default defineEventHandler(async (event) => {
  try {
    const user = requireAuth(event)

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        frequency: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
        currentStreak: true,
        longestStreak: true,
        totalCompletions: true,
        goalValue: true,
        isArchived: true,
        goalMetric: true,
        currentTargetValue: true,
        nextDueDate: true,
        habitLogs: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            completionStatus: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Map habits to include mostRecentLog and remove habitLogs array
    const habitsWithLogs = habits.map(habit => {
      const { habitLogs, ...habitWithoutLogs } = habit
      return {
        ...habitWithoutLogs,
        mostRecentLog: habitLogs.length > 0 ? habitLogs[0] : null
      }
    })


    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of day

    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999) // Set to end of day

    const todaysLogsCount = await prisma.habitLogs.count({
      where: {
        userId: user.id,
        completionStatus: CompletionStatus.completed,
        createdAt: {
          gte: today,
          lte: todayEnd
        }
      }
    })

    return {
      success: true,
      data: {
        habits: habitsWithLogs,
        completedToday: todaysLogsCount
      }
    }
  } catch (error) {
    console.error('Error fetching habits:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch habits'
    })
  }
})
