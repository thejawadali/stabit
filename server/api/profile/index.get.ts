import { PrismaClient } from "@prisma/client"
import { serverSupabaseUser } from '#supabase/server'


export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const prisma = new PrismaClient()

  const profile = await prisma.userProfile.findUnique({
    where: {
      userId: user?.sub,
    },
  })
  if (!profile) {
    return null
  }
  return profile
})