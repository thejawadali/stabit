import prisma from '../../../lib/prisma'
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
    const page = query.page ? parseInt(query.page as string) : 1
    const limit = query.limit ? parseInt(query.limit as string) : 5

    if (page < 1) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid page. Must be greater than 0'
      })
    }

    if (limit < 1 || limit > 50) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid limit. Must be between 1 and 50'
      })
    }

    const skip = (page - 1) * limit

    // Get recent habit logs with pagination
    const habitLogs = await prisma.habitLogs.findMany({
      where: {
        userId: user.sub,
        completionStatus: {
          in: [CompletionStatus.completed, CompletionStatus.partial]
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
      select: {
        id: true,
        value: true,
        createdAt: true,
        completionStatus: true,
        habit: {
          select: {
            name: true,
            icon: true,
            goalMetric: true,
          }
        }
      }
    })

    // Get total count for pagination info
    const totalCount = await prisma.habitLogs.count({
      where: {
        userId: user.sub,
        completionStatus: {
          in: [CompletionStatus.completed, CompletionStatus.partial]
        }
      }
    })

    return {
      success: true,
      data: {
        logs: habitLogs,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: skip + limit < totalCount
        }
      }
    }
  } catch (error: any) {
    console.error('Error fetching recent logs:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch recent logs'
    })
  }
})

