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

    const milestoneId = getRouterParam(event, 'id')

    if (!milestoneId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Milestone ID is required'
      })
    }

    // Check if milestone exists and belongs to user
    const existingMilestone = await prisma.habitMilestones.findFirst({
      where: {
        id: milestoneId,
        userId: user.sub
      }
    })

    if (!existingMilestone) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Milestone not found'
      })
    }

    // Delete milestone
    await prisma.habitMilestones.delete({
      where: {
        id: milestoneId
      }
    })

    return {
      success: true,
      message: 'Milestone deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting milestone:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete milestone'
    })
  }
})

