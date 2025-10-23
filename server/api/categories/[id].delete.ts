import { serverSupabaseUser } from "#supabase/server"
import { PrismaClient } from '@prisma/client'


export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await serverSupabaseUser(event)
  try {
    const categoryId = getRouterParam(event, 'id')
    
    if (!categoryId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: user?.sub
      },
      include: {
        habits: true
      }
    })

    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Check if category has habits
    if (existingCategory.habits && existingCategory.habits.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete category with existing habits. Please move or delete the habits first.'
      })
    }

    await prisma.category.delete({
      where: {
        id: categoryId
      }
    })

    return { success: true, message: 'Category deleted successfully' }
  } catch (error: any) {
    console.error('Error deleting category:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete category'
    })
  }
})
