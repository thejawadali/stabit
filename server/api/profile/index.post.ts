import { prisma } from '../../utils/prisma'
import { serverSupabaseUser } from '#supabase/server'
import { seedDefaultCategories } from '../../utils/seedCategories'


export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  // verify if profile already exists
  const profile = await prisma.userProfile.findUnique({
    where: {
      userId: user?.sub,
    },
  })
  if (profile) {
    return profile
  }

  const data = await readBody(event)

  try {
    const created = await prisma.userProfile.create({
      data: {
        userId: user?.sub,
        name: user?.user_metadata?.full_name,
        email: user?.user_metadata?.email,
        ...data
      }
    })

    // Seed default categories for new user
    if (user?.sub) {
      try {
        await seedDefaultCategories(prisma, user.sub)
      } catch (seedError) {
        console.error('Failed to seed default categories:', seedError)
      }
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