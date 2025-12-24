import { serverSupabaseUser } from "#supabase/server"
import { prisma } from '../../../utils/prisma'


export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  
  try {
    const habitId = getRouterParam(event, 'id')
    
    if (!habitId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Habit ID is required'
      })
    }

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
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

    // Delete habit (cascade will handle related records)
    await prisma.habit.delete({
      where: {
        id: habitId
      }
    })

    return { success: true, message: 'Habit deleted successfully' }
  } catch (error: any) {
    console.error('Error deleting habit:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete habit'
    })
  }
})

