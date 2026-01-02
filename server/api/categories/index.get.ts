import { prisma } from '../../utils/prisma'


export default defineEventHandler(async (event) => {
  const user = {id: '740b6eef-bcc8-4217-a423-9197d671d087'}
  try {
    
    const categories = await prisma.category.findMany({
      where: {
        userId: user.id
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
