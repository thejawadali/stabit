import { CompletionStatus, PrismaClient } from '@prisma/client'
import { serverSupabaseUser } from '#supabase/server'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.sub,
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
            name: true,
          },
        },
        currentStreak: true,
        longestStreak: true,
        totalCompletions: true,
        goalValue: true,
        isArchived: true,
        goalMetric: true,
        nextDueDate: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })


    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of day

    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999) // Set to end of day

    const todaysLogsCount = await prisma.habitLogs.count({
      where: {
        userId: user.sub,
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
        habits,
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
