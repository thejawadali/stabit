import { PrismaClient, CompletionStatus } from '@prisma/client'
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

    const habitId = getRouterParam(event, 'id')

    if (!habitId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Habit ID is required'
      })
    }

    const query = getQuery(event)
    const includeDetail = query.detail === 'true'

    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: user.sub
      },
      include: {
        category: {
          select: {
            id: true
          }
        },
        customFields: {
          orderBy: {
            sortingOrder: 'asc'
          },
          select: {
            id: true,
            title: true,
            type: true,
            options: true,
            placeholder: true,
            isRequired: true
          }
        }
      }
    })

    if (!habit) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Habit not found'
      })
    }

    // If detail is requested, calculate additional stats
    if (includeDetail) {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      thirtyDaysAgo.setHours(0, 0, 0, 0)

      // Get logs from the last 30 days
      const last30DaysLogs = await prisma.habitLogs.findMany({
        where: {
          habitId: habitId,
          userId: user.sub,
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Calculate stats
      const completedLogs = last30DaysLogs.filter(log => log.completionStatus === CompletionStatus.completed)
      const missedLogs = last30DaysLogs.filter(log => log.completionStatus === CompletionStatus.missed)
      const totalRelevantLogs = completedLogs.length + missedLogs.length

      // Completion rate: percentage of completed vs missed in last 30 days
      const completionRate = totalRelevantLogs > 0 
        ? Math.round((completedLogs.length / totalRelevantLogs) * 100)
        : 0

      // Total completions: count of completed logs
      const totalCompletions = completedLogs.length

      // Average duration: average of durationMinutes for completed logs that have duration
      const logsWithDuration = completedLogs.filter(log => log.durationMinutes !== null)
      const avgDuration = logsWithDuration.length > 0
        ? Math.round(
            logsWithDuration.reduce((sum, log) => sum + (log.durationMinutes || 0), 0) / logsWithDuration.length
          )
        : 0

      // Current streak: use habit's currentStreak field
      const currentStreak = habit.currentStreak

      return {
        success: true,
        data: {
          id: habit.id,
          name: habit.name,
          icon: habit.icon,
          description: habit.description,
          stats: {
            currentStreak,
            completionRate,
            totalCompletions,
            avgDuration
          },
          logs: last30DaysLogs.map(log => ({
            id: log.id,
            completionStatus: log.completionStatus,
            durationMinutes: log.durationMinutes,
            notes: log.notes,
            createdAt: log.createdAt
          }))
        }
      }
    }

    return {
      success: true,
      data: habit
    }
  } catch (error) {
    console.error('Error fetching habit:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch habit'
    })
  }
})
