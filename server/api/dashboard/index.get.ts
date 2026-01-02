import { prisma } from '../../utils/prisma'
import { CompletionStatus, Frequency, MilestoneStatus } from '@prisma/client'

export default defineEventHandler(async (event) => {
  try {
    const user = { id: '740b6eef-bcc8-4217-a423-9197d671d087' }


    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)

    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - 7)
    weekStart.setHours(0, 0, 0, 0)

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    thisMonthStart.setHours(0, 0, 0, 0)
    
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    thisMonthEnd.setHours(23, 59, 59, 999)
    
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    lastMonthStart.setHours(0, 0, 0, 0)
    
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
    lastMonthEnd.setHours(23, 59, 59, 999)

    const habitsDueToday = await prisma.habit.findMany({
      where: {
        userId: user.id,
        isArchived: false,
        nextDueDate: {
          lte: todayEnd
        }
      },
      orderBy: {
        timeOfDay: 'asc'
      },
      select: {
        id: true,
        name: true,
        icon: true,
        timeOfDay: true,
        isCompleted: true,
        goalMetric: true,
        currentTargetValue: true,
        category: {
          select: {
            id: true,
            name: true
          }
        },
        habitLogs: {
          where: {
            completionStatus: CompletionStatus.completed,
            createdAt: {
              gte: today,
              lte: todayEnd
            }
          },
          take: 1,
          select: {
            id: true
          }
        }
      }
    })

    const habitsWithCompletionStatus = habitsDueToday.map(habit => {
      const { habitLogs, ...habitWithoutLogs } = habit
      return {
        ...habitWithoutLogs,
        hasCompletedToday: habitLogs.length > 0
      }
    })

    const [
      completedToday,
      habitsWithStreaks,
      totalHabits,
      activeHabits,
      completedLogsThisWeek,
      totalLogsThisWeek,
      completedLogsThisMonth,
      totalLogsThisMonth,
      completedLogsLastMonth,
      totalLogsLastMonth,
      categories,
      recentMissedLogs,
      milestones,
      todayCompletedLogs
    ] = await Promise.all([
      prisma.habitLogs.count({
        where: {
          userId: user.id,
          completionStatus: CompletionStatus.completed,
          createdAt: {
            gte: today,
            lte: todayEnd
          }
        }
      }),
      prisma.habit.findMany({
        where: {
          userId: user.id,
          isArchived: false
        },
        select: {
          currentStreak: true
        }
      }),
      prisma.habit.count({
        where: {
          userId: user.id,
          isArchived: false
        }
      }),
      prisma.habit.findMany({
        where: {
          userId: user.id,
          isArchived: false
        },
        select: {
          id: true,
          frequency: true,
          createdAt: true
        }
      }),
      prisma.habitLogs.count({
        where: {
          userId: user.id,
          completionStatus: CompletionStatus.completed,
          createdAt: {
            gte: weekStart,
            lte: todayEnd
          }
        }
      }),
      prisma.habitLogs.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: weekStart,
            lte: todayEnd
          }
        }
      }),
      prisma.habitLogs.count({
        where: {
          userId: user.id,
          completionStatus: CompletionStatus.completed,
          createdAt: {
            gte: thisMonthStart,
            lte: thisMonthEnd
          }
        }
      }),
      prisma.habitLogs.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: thisMonthStart,
            lte: thisMonthEnd
          }
        }
      }),
      prisma.habitLogs.count({
        where: {
          userId: user.id,
          completionStatus: CompletionStatus.completed,
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }),
      prisma.habitLogs.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }),
      prisma.category.findMany({
        where: {
          userId: user.id
        },
        select: {
          id: true,
          name: true,
          icon: true
        }
      }),
      prisma.habitLogs.findMany({
        where: {
          userId: user.id,
          completionStatus: CompletionStatus.missed
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5,
        select: {
          id: true,
          createdAt: true,
          habit: {
            select: {
              id: true,
              name: true,
              icon: true
            }
          }
        }
      }),
      prisma.habitMilestones.findMany({
        where: {
          userId: user.id,
          status: MilestoneStatus.inProgress
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
      }),
      prisma.habitLogs.findMany({
        where: {
          userId: user.id,
          completionStatus: CompletionStatus.completed,
          createdAt: {
            gte: today,
            lte: todayEnd
          }
        },
        select: {
          habitId: true
        },
        distinct: ['habitId']
      })
    ])

    const activeStreak = habitsWithStreaks.length > 0
      ? Math.max(...habitsWithStreaks.map(h => h.currentStreak))
      : 0

    const habitsDueTodayIds = new Set(habitsDueToday.map(h => h.id))
    const todayCompletedHabitIds = new Set(todayCompletedLogs.map(log => log.habitId))
    const uniqueTodayHabits = new Set([...habitsDueTodayIds, ...todayCompletedHabitIds])
    const totalTodayHabits = uniqueTodayHabits.size

    let expectedCompletions = 0
    const now = new Date()

    for (const habit of activeHabits) {
      const daysSinceCreation = Math.floor(
        (now.getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      const daysToConsider = Math.min(daysSinceCreation, 7)

      if (daysToConsider <= 0) continue

      switch (habit.frequency) {
        case Frequency.daily:
          expectedCompletions += daysToConsider
          break
        case Frequency.weekly:
          expectedCompletions += Math.ceil(daysToConsider / 7)
          break
        case Frequency.monthly:
          expectedCompletions += Math.ceil(daysToConsider / 30)
          break
      }
    }

    const weeklyRate = expectedCompletions > 0
      ? Math.round((completedLogsThisWeek / expectedCompletions) * 100)
      : 0

    const weeklyCompletionPercentage = totalLogsThisWeek > 0
      ? Math.round((completedLogsThisWeek / totalLogsThisWeek) * 100)
      : 0

    const thisMonthCompletionPercentage = totalLogsThisMonth > 0
      ? (completedLogsThisMonth / totalLogsThisMonth) * 100
      : 0
    
    const lastMonthCompletionPercentage = totalLogsLastMonth > 0
      ? (completedLogsLastMonth / totalLogsLastMonth) * 100
      : 0
    
    const monthlyTrend = Math.round((thisMonthCompletionPercentage - lastMonthCompletionPercentage) * 100) / 100

    const totalSessions = totalLogsThisMonth

    const milestonesWithProgress = milestones.map(milestone => {
      const progressRate = milestone.targetValue > 0
        ? (milestone.currentProgress / milestone.targetValue) * 100
        : 0
      
      return {
        ...milestone,
        progressRate
      }
    })

    const topMilestones = milestonesWithProgress
      .sort((a, b) => b.progressRate - a.progressRate)
      .slice(0, 2)
      .map(milestone => {
        const remaining = Math.max(0, milestone.targetValue - milestone.currentProgress)
        const progressPercentage = milestone.targetValue > 0
          ? (milestone.currentProgress / milestone.targetValue) * 100
          : 0

        return {
          id: milestone.id,
          habitName: milestone.habit.name,
          habitIcon: milestone.habit.icon,
          name: milestone.name,
          targetValue: milestone.targetValue,
          targetMetric: milestone.targetMetric,
          currentProgress: Math.round(progressPercentage),
          remainingSessions: Math.round(remaining)
        }
      })

    return {
      success: true,
      data: {
        todayProgress: {
          completed: completedToday,
          total: totalTodayHabits
        },
        activeStreak,
        totalHabits,
        weeklyRate: Math.min(weeklyRate, 100),
        weeklyCompletionPercentage,
        monthlyTrend,
        totalSessions,
        categories,
        todayHabits: habitsWithCompletionStatus,
        missedHabits: recentMissedLogs,
        milestones: topMilestones
      }
    }
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch dashboard data'
    })
  }
})

