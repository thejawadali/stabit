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

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.sub,
      },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        recurrenceType: true,
        categoryId: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      data: habits
    }
  } catch (error) {
    console.error('Error fetching habits:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch habits'
    })
  }
})
