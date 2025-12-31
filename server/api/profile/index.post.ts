import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { seedDefaultCategories } from '../../utils/seedCategories'


export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  // verify if profile already exists
  const profile = await prisma.userProfile.findUnique({
    where: {
      userId: user.id,
    },
  })
  if (profile) {
    return profile
  }

  const data = await readBody(event)

  try {
    const created = await prisma.userProfile.create({
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        ...data
      }
    })

    // Seed default categories for new user
    try {
      await seedDefaultCategories(prisma, user.id)
    } catch (seedError) {
      console.error('Failed to seed default categories:', seedError)
    }

    return created
  } catch (error: any) {
    // Prisma P2002: Unique constraint failed (userId already exists)
    if (error?.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'UserProfile already exists' })
    }
    console.log(error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to create UserProfile' })
  }
})