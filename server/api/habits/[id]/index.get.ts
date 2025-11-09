import { PrismaClient } from '@prisma/client'
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
