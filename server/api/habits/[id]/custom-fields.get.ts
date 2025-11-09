import prisma from '../../../../lib/prisma'
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

    const habitId = getRouterParam(event, 'id')

    if (!habitId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Habit ID is required'
      })
    }

    // Check if habit exists and belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: user.sub
      },
      select: {
        id: true
      }
    })

    if (!habit) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Habit not found'
      })
    }

    // Fetch only custom fields
    const customFields = await prisma.habitCustomField.findMany({
      where: {
        habitId
      },
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
    })

    return {
      success: true,
      data: customFields
    }
  } catch (error) {
    console.error('Error fetching custom fields:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch custom fields'
    })
  }
})

