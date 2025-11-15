import prisma from '../../../lib/prisma'
import { serverSupabaseUser } from '#supabase/server'
import { HabitStatus, CompletionStatus, Frequency, MilestoneStatus } from '@prisma/client'

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of day

    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999) // Set to end of day

    // Calculate start of week (7 days ago)
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - 7)
    weekStart.setHours(0, 0, 0, 0)

    // Calculate month ranges for monthly trend
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    thisMonthStart.setHours(0, 0, 0, 0)
    
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    thisMonthEnd.setHours(23, 59, 59, 999)
    
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    lastMonthStart.setHours(0, 0, 0, 0)
    
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
    lastMonthEnd.setHours(23, 59, 59, 999)

    // 1. Get total habits that need to be logged today
    // Habits where nextDueDate is today or has passed, and status is active
    const habitsDueToday = await prisma.habit.findMany({
      where: {
        userId: user.sub,
        // status: HabitStatus.active,
        // isArchived: false,
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
        status: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Execute parallel queries for better performance
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
      milestones
    ] = await Promise.all([
      // 2. Get completed count today
      prisma.habitLogs.count({
        where: {
          userId: user.sub,
          completionStatus: CompletionStatus.completed,
          createdAt: {
            gte: today,
            lte: todayEnd
          }
        }
      }),
      // 3. Get habits with streaks for highest active streak
      prisma.habit.findMany({
        where: {
          userId: user.sub,
          status: HabitStatus.active,
          isArchived: false
        },
        select: {
          currentStreak: true
        }
      }),
      // 4. Get total active habits count
      prisma.habit.count({
        where: {
          userId: user.sub,
          status: HabitStatus.active,
          isArchived: false
        }
      }),
      // 5. Get all active habits for weekly rate calculation
      prisma.habit.findMany({
        where: {
          userId: user.sub,
          status: HabitStatus.active,
          isArchived: false
        },
        select: {
          id: true,
          frequency: true,
          createdAt: true
        }
      }),
      // Count completed logs in the last 7 days
      prisma.habitLogs.count({
        where: {
          userId: user.sub,
          completionStatus: CompletionStatus.completed,
          createdAt: {
            gte: weekStart,
            lte: todayEnd
          }
        }
      }),
      // NEW: Total logs this week (all statuses) for weekly completion percentage
      prisma.habitLogs.count({
        where: {
          userId: user.sub,
          createdAt: {
            gte: weekStart,
            lte: todayEnd
          }
        }
      }),
      // NEW: Completed logs this month for monthly trend
      prisma.habitLogs.count({
        where: {
          userId: user.sub,
          completionStatus: CompletionStatus.completed,
          createdAt: {
            gte: thisMonthStart,
            lte: thisMonthEnd
          }
        }
      }),
      // NEW: Total logs this month for monthly trend
      prisma.habitLogs.count({
        where: {
          userId: user.sub,
          createdAt: {
            gte: thisMonthStart,
            lte: thisMonthEnd
          }
        }
      }),
      // NEW: Completed logs last month for monthly trend
      prisma.habitLogs.count({
        where: {
          userId: user.sub,
          completionStatus: CompletionStatus.completed,
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }),
      // NEW: Total logs last month for monthly trend
      prisma.habitLogs.count({
        where: {
          userId: user.sub,
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }),
      // 6. Get categories
      prisma.category.findMany({
        where: {
          userId: user.sub
        },
        select: {
          id: true,
          name: true,
          icon: true
        }
      }),
      // 7. Get last 5 most recent missed habits
      prisma.habitLogs.findMany({
        where: {
          userId: user.sub,
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
      // 8. Get milestones for progress calculation (only inProgress to get active milestones)
      prisma.habitMilestones.findMany({
        where: {
          userId: user.sub,
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
      })
    ])

    // Calculate highest active streak
    const activeStreak = habitsWithStreaks.length > 0
      ? Math.max(...habitsWithStreaks.map(h => h.currentStreak))
      : 0

    // Calculate expected completions based on frequency
    // For each habit, calculate how many times it should have been completed in the last 7 days
    let expectedCompletions = 0
    const now = new Date()

    for (const habit of activeHabits) {
      // Calculate how many days since habit was created or 7 days, whichever is less
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
          // In 7 days, weekly habits should complete once
          expectedCompletions += Math.ceil(daysToConsider / 7)
          break
        case Frequency.monthly:
          // In 7 days, monthly habits might complete 0 times (less than a month)
          expectedCompletions += Math.ceil(daysToConsider / 30)
          break
      }
    }

    // Calculate weekly completion rate as percentage (based on expected completions)
    const weeklyRate = expectedCompletions > 0
      ? Math.round((completedLogsThisWeek / expectedCompletions) * 100)
      : 0

    // NEW: Calculate weekly completion percentage (completed logs / total logs this week)
    const weeklyCompletionPercentage = totalLogsThisWeek > 0
      ? Math.round((completedLogsThisWeek / totalLogsThisWeek) * 100)
      : 0

    // NEW: Calculate monthly trend (this month vs last month completion percentage)
    const thisMonthCompletionPercentage = totalLogsThisMonth > 0
      ? (completedLogsThisMonth / totalLogsThisMonth) * 100
      : 0
    
    const lastMonthCompletionPercentage = totalLogsLastMonth > 0
      ? (completedLogsLastMonth / totalLogsLastMonth) * 100
      : 0
    
    const monthlyTrend = Math.round((thisMonthCompletionPercentage - lastMonthCompletionPercentage) * 100) / 100

    // NEW: Total sessions this month (same as totalLogsThisMonth)
    const totalSessions = totalLogsThisMonth

    // Calculate milestones with highest progress rate
    const milestonesWithProgress = milestones.map(milestone => {
      const progressRate = milestone.targetValue > 0
        ? (milestone.currentProgress / milestone.targetValue) * 100
        : 0
      
      return {
        ...milestone,
        progressRate
      }
    })

    // Sort by progress rate descending and take top 2
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
          total: habitsDueToday.filter(habit => habit.status === HabitStatus.active).length
        },
        activeStreak, // Highest active streak (already calculated)
        totalHabits,
        weeklyRate: Math.min(weeklyRate, 100), // Cap at 100%
        weeklyCompletionPercentage, // NEW: Percentage of completed logs this week
        monthlyTrend, // NEW: Change in completion percentage vs last month (+ve if increased, -ve if decreased)
        totalSessions, // NEW: Total logs (sessions) this month
        categories,
        todayHabits: habitsDueToday,
        missedHabits: recentMissedLogs,
        milestones: topMilestones // NEW: Top 2 milestones with highest progress rate
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

