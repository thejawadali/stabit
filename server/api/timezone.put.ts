import { PrismaClient } from "@prisma/client"
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const prisma = new PrismaClient()

  const { timezone } = await readBody(event)

  const profile = await prisma.userProfile.update({
    where: { userId: user?.sub },
    data: { timezone },
  })

  return profile
})