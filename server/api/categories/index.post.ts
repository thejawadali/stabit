import { prisma } from '../../utils/prisma'


export default defineEventHandler(async (event) => {
  const user = {id: '740b6eef-bcc8-4217-a423-9197d671d087'}
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required'
      })
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
        description: body.description || null,
        color: body.color || '#3B82F6',
        icon: body.icon || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
        userId: user.id
      },
      include: {
        habits: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        }
      }
    })

    return category
  } catch (error: any) {
    console.error('Error creating category:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create category'
    })
  }
})
