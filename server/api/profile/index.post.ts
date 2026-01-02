import { prisma } from '../../utils/prisma'
import { seedDefaultCategories } from '../../utils/seedCategories'


export default defineEventHandler(async (event) => {
  const user = {id: '740b6eef-bcc8-4217-a423-9197d671d087'}

  // verify if config already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      config: true,
    },
  })
  if (existingUser?.config) {
    return {
      ...existingUser,
      ...existingUser.config,
    }
  }

  const data = await readBody(event)

  try {
    // Create config for user
    const config = await prisma.config.create({
      data: {
        userId: user.id,
        ...data
      }
    })

    // Seed default categories for new user
    try {
      await seedDefaultCategories(prisma, user.id)
    } catch (seedError) {
      console.error('Failed to seed default categories:', seedError)
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    })

    return {
      ...userData,
      ...config,
    }
  } catch (error: any) {
    // Prisma P2002: Unique constraint failed (userId already exists)
    if (error?.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Config already exists' })
    }
    console.log(error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to create config' })
  }
})