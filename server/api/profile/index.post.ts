import { PrismaClient } from "@prisma/client"
import { serverSupabaseUser } from '#supabase/server'


export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const prisma = new PrismaClient()

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