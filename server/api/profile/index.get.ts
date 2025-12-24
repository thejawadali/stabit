import { prisma } from '../../utils/prisma'
import { serverSupabaseUser } from '#supabase/server'


export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  const profile: any = await prisma.userProfile.findUnique({
    where: {
      userId: user?.sub,
    },
  })
  if (!profile) {
    return null
  }

  return profile
})