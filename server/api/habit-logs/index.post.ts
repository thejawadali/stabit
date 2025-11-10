import prisma from '../../../lib/prisma'
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

    const body = await readBody(event)

    const {
      habitId,
      durationMinutes,
      notes,
      customFields
    } = body

    // Validate required fields
    if (!habitId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'habitId is required'
      })
    }

    // Check if habit exists and belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: user.sub
      }
    })

    if (!habit) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Habit not found'
      })
    }

    // Default status to 'completed'
    const completionStatus = 'completed'

    // Create habit log
    const habitLog = await prisma.habitLogs.create({
      data: {
        habitId,
        userId: user.sub,
        completionStatus,
        value: 0, // Default value since quantity is removed
        durationMinutes: durationMinutes ? parseInt(String(durationMinutes)) : null,
        notes: notes?.trim() || null,
        customFields: customFields && Object.keys(customFields).length > 0 
          ? customFields 
          : null
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

    // Update habit statistics
    await prisma.habit.update({
      where: { id: habitId },
      data: {
        totalCompletions: { increment: 1 }
      }
    })

    return {
      success: true,
      message: 'Habit log created successfully',
      data: habitLog
    }
  } catch (error: any) {
    console.error('Error creating habit log:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create habit log'
    })
  }
})

