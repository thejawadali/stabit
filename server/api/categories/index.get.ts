import { serverSupabaseUser } from "#supabase/server"
import { PrismaClient } from '@prisma/client'


export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await serverSupabaseUser(event)
  try {
    
    const categories = await prisma.category.findMany({
      where: {
        userId: user?.sub
      },
      include: {
        habits: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories'
    })
  }
})
