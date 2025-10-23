import { PrismaClient } from '@prisma/client'
import { serverSupabaseUser } from '#supabase/server'


export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await serverSupabaseUser(event)
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
