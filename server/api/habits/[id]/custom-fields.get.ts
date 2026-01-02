import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const user = { id: '740b6eef-bcc8-4217-a423-9197d671d087' }

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
        userId: user.id
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

