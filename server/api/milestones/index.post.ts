import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = { id: '740b6eef-bcc8-4217-a423-9197d671d087' }

    const body = await readBody(event)

    // Validate required fields
    const {
      habitId,
      name,
      description,
      targetValue,
      rewardName,
      rewardDescription,
      rewardIcon = '🎉'
    } = body

    if (!habitId || !name || targetValue === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'habitId, name, and targetValue are required'
      })
    }

    // Verify habit belongs to user and get its goalMetric
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: user.id
      }
    })

    if (!habit) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Habit not found'
      })
    }

    // Use habit's goalMetric as targetMetric
    const targetMetric = habit.goalMetric

    // make sure milestone with same habit, taragetMetric and targetValue does not exist
    const existingMilestone = await prisma.habitMilestones.findFirst({
      where: {
        habitId,
        targetMetric,
        targetValue
      }
    })
    if (existingMilestone) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Déjà vu? You\'ve already created this milestone.'
        // statusMessage: 'A milestone with the same habit, target metric, and target value already exists.'
      })
    }

    // Create milestone
    const milestone = await prisma.habitMilestones.create({
      data: {
        habitId,
        userId: user.id,
        name,
        description: description || null,
        targetValue: parseFloat(targetValue),
        targetMetric,
        rewardName: rewardName || null,
        rewardDescription: rewardDescription || null,
        rewardIcon,
        status: 'locked',
        currentProgress: 0
      },
      include: {
        habit: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      }
    })

    return {
      success: true,
      message: 'Milestone created successfully',
      data: milestone
    }
  } catch (error: any) {
    console.error('Error creating milestone:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create milestone'
    })
  }
})

