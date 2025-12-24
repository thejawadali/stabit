import { prisma } from '../../../utils/prisma'
import { serverSupabaseUser } from '#supabase/server'
import type { Prisma } from '@prisma/client'



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
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: user.sub
      }
    })

    if (!existingHabit) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Habit not found'
      })
    }


    await prisma.habit.update({
      where: { id: habitId },
      data: { isArchived: !existingHabit.isArchived }
    })

    return {
      success: true,
      data: { isArchived: !existingHabit.isArchived },
      message: 'Habit updated successfully'
    }
  } catch (error) {
    console.error('Error updating status:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update habit'
    })
  }
})
