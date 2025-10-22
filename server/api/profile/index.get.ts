import { PrismaClient, type UserProfile } from "@prisma/client"
import { serverSupabaseUser } from '#supabase/server'


export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const prisma = new PrismaClient()

  const profile: UserProfile | null = await prisma.userProfile.findUnique({
    where: {
      userId: user?.sub,
    },
  })
  if (!profile) {
    return null
  }

  return profile
})