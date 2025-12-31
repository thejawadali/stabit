import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = { id: '740b6eef-bcc8-4217-a423-9197d671d087' }

  const { timezone } = await readBody(event)

  const profile = await prisma.userProfile.update({
    where: { userId: user.id },
    data: { timezone },
  })

  return profile
})