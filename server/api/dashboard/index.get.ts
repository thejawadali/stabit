import prisma from '../../../lib/prisma'
import { serverSupabaseUser } from '#supabase/server'
import { HabitStatus, CompletionStatus, Frequency } from '@prisma/client'

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

    // 1. Get total habits that need to be logged today
    // Habits where nextDueDate is today or has passed, and status is active
    const habitsDueToday = await prisma.habit.count({
      where: {
        userId: user.sub,
        status: HabitStatus.active,
        isArchived: false,
        nextDueDate: {
          lte: todayEnd // Less than or equal to end of today
        }
      }
    })

    // 2. Get completed count today
    const completedToday = await prisma.habitLogs.count({
      where: {
        userId: user.sub,
        completionStatus: CompletionStatus.completed,
        createdAt: {
          gte: today,
          lte: todayEnd
        }
      }
    })

    // 3. Get longest active streak of all habits
    const habitsWithStreaks = await prisma.habit.findMany({
      where: {
        userId: user.sub,
        status: HabitStatus.active,
        isArchived: false
      },
      select: {
        currentStreak: true
      }
    })

    const activeStreak = habitsWithStreaks.length > 0
      ? Math.max(...habitsWithStreaks.map(h => h.currentStreak))
      : 0

    // 4. Get total active habits count
    const totalHabits = await prisma.habit.count({
      where: {
        userId: user.sub,
        status: HabitStatus.active,
        isArchived: false
      }
    })

    // 5. Calculate weekly completion rate
    // Get all active habits
    const activeHabits = await prisma.habit.findMany({
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
    })

    // Count completed logs in the last 7 days
    const completedLogsThisWeek = await prisma.habitLogs.count({
      where: {
        userId: user.sub,
        completionStatus: CompletionStatus.completed,
        createdAt: {
          gte: weekStart,
          lte: todayEnd
        }
      }
    })

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

    // Calculate weekly completion rate as percentage
    const weeklyRate = expectedCompletions > 0
      ? Math.round((completedLogsThisWeek / expectedCompletions) * 100)
      : 0

    return {
      success: true,
      data: {
        todayProgress: {
          completed: completedToday,
          total: habitsDueToday
        },
        activeStreak,
        totalHabits,
        weeklyRate: Math.min(weeklyRate, 100) // Cap at 100%
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

