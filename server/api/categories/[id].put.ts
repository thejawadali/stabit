import { serverSupabaseUser } from "#supabase/server"
import { PrismaClient } from '@prisma/client'


export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await serverSupabaseUser(event)
  try {
    const categoryId = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!categoryId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    // Validate required fields
    if (!body.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required'
      })
    }

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: user?.sub
      }
    })

    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    const category = await prisma.category.update({
      where: {
        id: categoryId
      },
      data: {
        name: body.name,
        description: body.description || null,
        color: body.color || '#3B82F6',
        icon: body.icon || null,
        isActive: body.isActive !== undefined ? body.isActive : true
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
    console.error('Error updating category:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update category'
    })
  }
})
