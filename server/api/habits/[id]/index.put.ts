import prisma from '../../../../lib/prisma'
import { serverSupabaseUser } from '#supabase/server'
import type { Prisma } from '@prisma/client'

type CustomFieldPayload = {
  id?: string
  title: string
  type: 'text' | 'number' | 'select' | 'boolean'
  options?: string[]
  isRequired?: boolean
  required?: boolean
  sortingOrder?: number
}

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const habitId = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!habitId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Habit ID is required'
      })
    }

    // Check if habit exists and belongs to user
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: user.id
      }
    })

    if (!existingHabit) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Habit not found'
      })
    }

    // ✅ Validate required fields
    const {
      name,
      categoryId,
      customFields = [],
      rewards = [],
      description,
      icon,
      recurrenceType,
      timeOfDay,
      initialValue,
      difficultyRate,
      goalValue,
      goalMetric,
      estimatedCompletionDate,
      status,
      enableNotifications,
      reminderTimes,
      isArchived,
      isActive,
    } = body

    if (!name || !categoryId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Both 'name' and 'categoryId' are required.",
      })
    }

    // Update habit using transaction
    const finalHabit = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Step 1: Build update data object, only including provided fields
      const updateData: any = {
        description,
        name,
        categoryId,
        icon,
        recurrenceType,
        timeOfDay,
        initialValue,
        difficultyRate,
        goalValue,
        goalMetric,
        estimatedCompletionDate,
        status,
      }

      // Add optional fields only if they are provided
      updateData.enableNotifications = enableNotifications || false
      updateData.reminderTimes = JSON.parse(JSON.stringify(reminderTimes)) || []
      updateData.isArchived = isArchived || false
      updateData.isActive = isActive || true

      // Update the habit itself
      await tx.habit.update({
        where: { id: habitId },
        data: updateData
      })

      // Step 2: Handle custom fields
      if (Array.isArray(customFields)) {
        // Fetch existing custom fields
        const existing = await tx.habitCustomField.findMany({
          where: { habitId }
        })

        const payload = customFields as CustomFieldPayload[]

        // Step 3: Determine actions
        const payloadIds = payload.filter((f: CustomFieldPayload) => f.id).map((f: CustomFieldPayload) => f.id!)

        const toDelete = existing.filter((f: { id: string }) => !payloadIds.includes(f.id))
        const toUpdate = payload.filter((f: CustomFieldPayload) => f.id)
        const toCreate = payload.filter((f: CustomFieldPayload) => !f.id)

        // Step 4a: Delete removed custom fields
        if (toDelete.length) {
          await tx.habitCustomField.deleteMany({
            where: { id: { in: toDelete.map((f: { id: string }) => f.id) } }
          })
        }

        // Step 4b: Update existing fields
        for (const field of toUpdate) {
          await tx.habitCustomField.update({
            where: { id: field.id },
            data: {
              title: field.title,
              type: field.type,
              options: field.options ? JSON.parse(JSON.stringify(field.options)) : null,
              isRequired: field.isRequired ?? field.required ?? false,
              sortingOrder: field.sortingOrder ?? 0
            }
          })
        }

        // Step 4c: Create new fields
        if (toCreate.length) {
          await tx.habitCustomField.createMany({
            data: toCreate.map(f => ({
              habitId,
              title: f.title,
              type: f.type,
              options: f.options ? JSON.parse(JSON.stringify(f.options)) : null,
              isRequired: f.isRequired ?? f.required ?? false,
              sortingOrder: f.sortingOrder ?? 0
            }))
          })
        }
      }

      // Step 5: Handle rewards (similar pattern)
      if (Array.isArray(rewards)) {
        const existingRewards = await tx.habitRewards.findMany({
          where: { habitId }
        })

        const rewardPayload = rewards as Array<{
          id?: string
          milestoneValue: number
          name: string
          description?: string
          icon?: string
          sortingOrder?: number
        }>

        const rewardPayloadIds = rewardPayload.filter((r) => r.id).map((r) => r.id!)

        const rewardsToDelete = existingRewards.filter((r: { id: string }) => !rewardPayloadIds.includes(r.id))
        const rewardsToUpdate = rewardPayload.filter((r: { id?: string }) => r.id)
        const rewardsToCreate = rewardPayload.filter((r: { id?: string }) => !r.id)

        // Delete removed rewards
        if (rewardsToDelete.length) {
          await tx.habitRewards.deleteMany({
            where: { id: { in: rewardsToDelete.map((r: { id: string }) => r.id) } }
          })
        }

        // Update existing rewards
        for (const reward of rewardsToUpdate) {
          await tx.habitRewards.update({
            where: { id: reward.id },
            data: {
              milestoneValue: reward.milestoneValue,
              name: reward.name,
              description: reward.description ?? '',
              icon: reward.icon ?? '🏆',
              sortingOrder: reward.sortingOrder ?? 0
            }
          })
        }

        // Create new rewards
        if (rewardsToCreate.length) {
          await tx.habitRewards.createMany({
            data: rewardsToCreate.map(r => ({
              habitId,
              milestoneValue: r.milestoneValue,
              name: r.name,
              description: r.description ?? '',
              icon: r.icon ?? '🏆',
              sortingOrder: r.sortingOrder ?? 0
            }))
          })
        }
      }

      // Step 6: Return updated habit with fields
      return tx.habit.findUnique({
        where: { id: habitId },
        include: {
          customFields: {
            orderBy: {
              sortingOrder: 'asc'
            }
          },
          rewards: {
            orderBy: {
              sortingOrder: 'asc'
            }
          }
        }
      })
    })

    return {
      success: true,
      data: finalHabit,
      message: 'Habit updated successfully'
    }
  } catch (error) {
    console.error('Error updating habit:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update habit'
    })
  }
})
