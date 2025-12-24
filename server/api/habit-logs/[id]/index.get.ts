import { prisma } from '../../../utils/prisma'
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

    const logId = getRouterParam(event, 'id')

    if (!logId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Log ID is required'
      })
    }

    const habitLog = await prisma.habitLogs.findFirst({
      where: {
        id: logId,
        userId: user.sub
      },
      include: {
        habit: {
          select: {
            id: true,
            name: true,
            icon: true,
            customFields: {
              orderBy: {
                sortingOrder: 'asc'
              }
            }
          }
        }
      }
    })

    if (!habitLog) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Habit log not found'
      })
    }

    return {
      success: true,
      data: habitLog
    }
  } catch (error) {
    console.error('Error fetching habit log:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch habit log'
    })
  }
})

