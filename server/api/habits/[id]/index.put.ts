import { prisma } from '../../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import type { Prisma } from '@prisma/client'

type CustomFieldPayload = {
  id?: string
  title: string
  type: 'text' | 'number' | 'select' | 'boolean'
  options?: string[]
  isRequired?: boolean
  placeholder?: string
  required?: boolean
  sortingOrder?: number
}

export default defineEventHandler(async (event) => {
  try {
    const user = { id: '740b6eef-bcc8-4217-a423-9197d671d087' }

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
      description,
      icon,
      frequency,
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
        frequency,
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
              placeholder: field.placeholder ?? null,
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
              placeholder: f.placeholder ?? null,
              isRequired: f.isRequired ?? f.required ?? false,
              sortingOrder: f.sortingOrder ?? 0
            }))
          })
        }
      }

      // Step 5: Return updated habit with fields
      return tx.habit.findUnique({
        where: { id: habitId },
        include: {
          customFields: {
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
