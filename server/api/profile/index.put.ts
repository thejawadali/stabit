import { PrismaClient } from "@prisma/client"
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const prisma = new PrismaClient()

  try {
    // Check if profile exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: {
        userId: user.id,
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
    if (updateData.lastSyncTime) {
      updateData.lastSyncTime = new Date(updateData.lastSyncTime)
    }
    // if (updateData.snoozeUntil) {
    //   updateData.snoozeUntil = new Date(updateData.snoozeUntil)
    // }

    // Handle JSON serialization for quietHoursDays
    if (updateData.quietHoursDays) {
      updateData.quietHoursDays = JSON.stringify(updateData.quietHoursDays)
    }

    // Update the profile
    const updatedProfile = await prisma.userProfile.update({
      where: {
        userId: user.id,
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
