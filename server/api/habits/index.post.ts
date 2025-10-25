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

    const body = await readBody(event)
    // const {
    //   name,
    //   description,
    //   icon,
    //   color,
    //   recurrenceType,
    //   customRecurrence,
    //   timeOfDay,
    //   initialValue,
    //   difficultyRate,
    //   autoGrowth,
    //   goalValue,
    //   goalMetric,
    //   estimatedCompletionDate,
    //   status,
    //   categoryId,
    //   customFields,
    //   milestones
    // } = body

    // Validate required fields
    if (!body.name || !body.categoryId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, categoryId are required'
      })
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: body.categoryId }
    })

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Create habit with related data
    const habit = await prisma.habit.create({
      data: {
        ...body,
        userId: user.sub
      }
    })

    return {
      success: true,
      data: habit,
      message: 'Habit created successfully'
    }
  } catch (error) {
    console.error('Error creating habit:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create habit'
    })
  }
})
