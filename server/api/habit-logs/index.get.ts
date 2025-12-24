import { prisma } from '../../utils/prisma'
import { serverSupabaseUser } from '#supabase/server'

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
    const habitId = query.habitId as string | undefined
    const createdAtStart = query.createdAtStart as string | undefined
    const createdAtEnd = query.createdAtEnd as string | undefined
    const completionStatus = query.completionStatus as 'completed' | 'partial' | 'missed' | 'skipped' | undefined

    const where: any = {
      userId: user.sub
    }

    // Filter by habitId
    if (habitId) {
      where.habitId = habitId
    }

    // Filter by createdAt
    if (createdAtStart || createdAtEnd) {
      where.createdAt = {}
      if (createdAtStart) {
        where.createdAt.gte = new Date(createdAtStart)
      }
      if (createdAtEnd) {
        where.createdAt.lte = new Date(createdAtEnd)
      }
    }

    // Filter by completionStatus
    if (completionStatus) {
      const validStatuses = ['completed', 'partial', 'missed', 'skipped']
      if (validStatuses.includes(completionStatus)) {
        where.completionStatus = completionStatus
      } else {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid completionStatus. Allowed values are: ${validStatuses.join(', ')}`
        })
      }
    }

    const logs = await prisma.habitLogs.findMany({
      where,
      include: {
        habit: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      data: logs
    }
  } catch (error: any) {
    console.error('Error fetching habit logs:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch habit logs'
    })
  }
})

