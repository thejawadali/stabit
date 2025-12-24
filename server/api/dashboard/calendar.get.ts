import { prisma } from '../../utils/prisma'
import { serverSupabaseUser } from '#supabase/server'
import { CompletionStatus } from '@prisma/client'

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const query = getQuery(event)
    const now = new Date()
    const month = query.month ? parseInt(query.month as string) : now.getMonth() + 1
    const year = query.year ? parseInt(query.year as string) : now.getFullYear()

    if (month < 1 || month > 12) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid month. Must be between 1 and 12'
      })
    }

    if (year < 2000 || year > 2100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid year'
      })
    }

    const monthStart = new Date(year, month - 1, 1)
    monthStart.setHours(0, 0, 0, 0)

    const monthEnd = new Date(year, month, 0)
    monthEnd.setHours(23, 59, 59, 999)

    // Get all habit logs for the specified month
    const habitLogs = await prisma.habitLogs.findMany({
      where: {
        userId: user.sub,
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        }
      },
      select: {
        id: true,
        createdAt: true,
        completionStatus: true
      }
    })

    const logsByDay: Record<number, CompletionStatus[]> = {}

    habitLogs.forEach(log => {
      const logDate = new Date(log.createdAt)
      const day = logDate.getDate()
      
      if (!logsByDay[day]) {
        logsByDay[day] = []
      }
      
      logsByDay[day].push(log.completionStatus)
    })

    // Initialize result arrays
    const completed: number[] = []
    const partial: number[] = []
    const missed: number[] = []

    // Process each day group
    Object.keys(logsByDay).forEach(dayStr => {
      const day = parseInt(dayStr)
      const dayLogs = logsByDay[day]

      if (!dayLogs || dayLogs.length === 0) {
        return // Skip days with no logs
      }

      const completedCount = dayLogs.filter(status => status === CompletionStatus.completed).length
      const missedCount = dayLogs.filter(status => status === CompletionStatus.missed).length
      const partialCount = dayLogs.filter(status => status === CompletionStatus.partial).length
      const totalLogs = dayLogs.length

      // If all logs are completed
      if (completedCount === totalLogs) {
        completed.push(day)
      }
      // If some are missed and some are completed
      else if (completedCount > 0 && missedCount > 0) {
        partial.push(day)
      }
      // If all are missed
      else if (missedCount === totalLogs) {
        missed.push(day)
      }
      // If there are partial status logs (with or without other statuses)
      else if (partialCount > 0) {
        partial.push(day)
      }
    })

    return {
      success: true,
      data: {
        completed,
        partial,
        missed
      }
    }
  } catch (error: any) {
    console.error('Error fetching calendar data:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch calendar data'
    })
  }
})

