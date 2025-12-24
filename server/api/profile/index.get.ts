import { type UserProfile } from "@prisma/client"
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'


export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

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