import { serverSupabaseUser } from "#supabase/server"
import { prisma } from '../../utils/prisma'


export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  try {
    
    const categories = await prisma.category.findMany({
      where: {
        userId: user?.sub
      },
      include: {
        _count: {
          select: {
            habits: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return categories.map(({ _count, ...category }) => ({
      ...category,
      _count: undefined,
      habitsCount: _count.habits
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories'
    })
  }
})
