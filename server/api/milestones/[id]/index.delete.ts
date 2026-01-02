import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const user = { id: '740b6eef-bcc8-4217-a423-9197d671d087' }

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
        userId: user.id
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

