import { type UserProfile } from "@prisma/client"
import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'


export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const profile: UserProfile | null = await prisma.userProfile.findUnique({
    where: {
      userId: user.id,
    },
  })
  if (!profile) {
    return null
  }

  return profile
})