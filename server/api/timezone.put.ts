import { prisma } from '../utils/prisma'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  const { timezone } = await readBody(event)

  const profile = await prisma.userProfile.update({
    where: { userId: user?.sub },
    data: { timezone },
  })

  return profile
})