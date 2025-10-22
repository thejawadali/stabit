import { PrismaClient } from "@prisma/client"
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const prisma = new PrismaClient()

  try {
    // Check if profile exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: {
        userId: user?.sub,
      },
    })

    if (!existingProfile) {
      throw createError({ statusCode: 404, statusMessage: 'UserProfile not found' })
    }

    const data = await readBody(event)

    delete data.email


    // Filter out any fields that aren't allowed
    const updateData = Object.keys(data)
      .reduce((obj, key) => {
        obj[key] = data[key]
        return obj
      }, {} as any)

    // Handle date conversion for DateTime fields
    if (updateData.defaultReminderTime) {
      updateData.defaultReminderTime = new Date(updateData.defaultReminderTime)
    }
    if (updateData.lastSyncTime) {
      updateData.lastSyncTime = new Date(updateData.lastSyncTime)
    }

    // Update the profile
    const updatedProfile = await prisma.userProfile.update({
      where: {
        userId: user?.sub,
      },
      data: updateData,
    })

    return updatedProfile
  } catch (error: any) {
    console.error('Profile update error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    // Handle Prisma validation errors
    if (error.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Unique constraint failed' })
    }
    
    throw createError({ statusCode: 500, statusMessage: 'Failed to update UserProfile' })
  } 
})
