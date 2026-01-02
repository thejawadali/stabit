import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = {id: '740b6eef-bcc8-4217-a423-9197d671d087'}

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        config: true,
      },
    })

    if (!existingUser) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    const data = await readBody(event)

    // Separate User fields from Config fields
    const userFields = ['name', 'age', 'gender', 'height', 'image']
    const configFields = [
      'timezone', 'theme', 'isActive', 'personalGoals',
      'preferredTimeUnits', 'preferredCountUnits', 'defaultTrackingType', 'defaultGoalFrequency',
      'notificationsEnabled', 'enableReminders', 'enableMilestones', 'enableStreaks',
      'defaultReminderTime', 'reminderTone', 'smartReminders',
      'inAppNotifications', 'emailNotifications', 'pushNotifications',
      'quietHoursEnabled', 'quietHoursStart', 'quietHoursEnd', 'quietHoursDays',
      'snoozeDuration', 'isSnoozed', 'snoozeUntil'
    ]

    // Don't allow updating email, id, or auth-related fields
    delete data.email
    delete data.id
    delete data.createdAt
    delete data.updatedAt

    const userUpdateData: any = {}
    const configUpdateData: any = {}

    // Separate user and config fields
    Object.keys(data).forEach((key) => {
      if (userFields.includes(key)) {
        userUpdateData[key] = data[key]
      } else if (configFields.includes(key)) {
        configUpdateData[key] = data[key]
      }
    })

    // Handle date conversion for DateTime fields
    if (configUpdateData.snoozeUntil) {
      configUpdateData.snoozeUntil = new Date(configUpdateData.snoozeUntil)
    }

    // Handle JSON serialization for quietHoursDays
    if (configUpdateData.quietHoursDays) {
      configUpdateData.quietHoursDays = JSON.stringify(configUpdateData.quietHoursDays)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: userUpdateData,
    })

    // Update or create config
    let updatedConfig
    if (Object.keys(configUpdateData).length > 0) {
      if (existingUser.config) {
        updatedConfig = await prisma.config.update({
          where: {
            userId: user.id,
          },
          data: configUpdateData,
        })
      } else {
        updatedConfig = await prisma.config.create({
          data: {
            userId: user.id,
            ...configUpdateData,
          },
        })
      }
    } else {
      updatedConfig = existingUser.config
    }

    // Return combined data for backward compatibility
    return {
      ...updatedUser,
      ...updatedConfig,
    }
  } catch (error: any) {
    console.error('Profile update error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    // Handle Prisma validation errors
    if (error.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Unique constraint failed' })
    }
    
    throw createError({ statusCode: 500, statusMessage: 'Failed to update profile' })
  } 
})
