import { prisma } from '../../utils/prisma'


export default defineEventHandler(async (event) => {
  const user = {id: '740b6eef-bcc8-4217-a423-9197d671d087'}

  const userData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      config: true,
    },
  })
  if (!userData) {
    return null
  }

  // Combine user and config data for backward compatibility
  return {
    ...userData,
    ...userData.config,
  }
})