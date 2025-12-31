import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = { id: '740b6eef-bcc8-4217-a423-9197d671d087' }

    const query = getQuery(event)
    const habitId = query.habitId as string | undefined
    const status = query.status as string | undefined // 'locked' | 'inProgress' | 'achieved'
    const sortBy = (query.sortBy as string) || 'progress' // 'progress' | 'newest' | 'oldest'
    const search = query.search as string | undefined
    // Build where clause
    const where: any = {
      userId: user.id
    }

    if (habitId && habitId !== 'all') {
      where.habitId = habitId
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (search && search.trim() !== '') {
      where.name = {
        contains: search.trim(),
        // mode: 'insensitive' // TODO: case-insensitive search
      }
    }

    // Fetch milestones
    const milestones = await prisma.habitMilestones.findMany({
      where,
      include: {
        habit: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      },
      orderBy: (() => {
        switch (sortBy) {
          case 'newest':
            return { createdAt: 'desc' }
          case 'oldest':
            return { createdAt: 'asc' }
          case 'progress':
          default:
            // Sort by progress percentage (descending)
            return { currentProgress: 'desc' }
        }
      })()
    })

    // Calculate stats
    const stats = {
      achieved: milestones.filter(m => m.status === 'achieved').length,
      inProgress: milestones.filter(m => m.status === 'inProgress').length,
      locked: milestones.filter(m => m.status === 'locked').length,
      totalRewards: milestones.filter(m => m.currentProgress >= m.targetValue).length
    }

    // Get completed milestones history (achieved milestones)
    const completedHistory = milestones
      .filter(m => m.status === 'achieved')
      .map(m => ({
        id: m.id,
        habitId: m.habitId,
        habitName: m.habit.name,
        habitIcon: m.habit.icon,
        milestoneName: m.name,
        milestoneDescription: m.description,
        rewardName: m.rewardName,
        rewardDescription: m.rewardDescription,
        rewardIcon: m.rewardIcon,
        achievedDate: m.achievedDate,
        targetValue: m.targetValue,
        targetMetric: m.targetMetric
      }))
      .sort((a, b) => {
        // Sort by achievedDate descending (most recent first)
        if (!a.achievedDate) return 1
        if (!b.achievedDate) return -1
        return new Date(b.achievedDate).getTime() - new Date(a.achievedDate).getTime()
      })

    // Format milestones for response
    const formattedMilestones = milestones.map(m => ({
      id: m.id,
      habitId: m.habitId,
      habitName: m.habit.name,
      habitIcon: m.habit.icon,
      name: m.name,
      description: m.description,
      targetValue: m.targetValue,
      targetMetric: m.targetMetric,
      rewardName: m.rewardName,
      rewardDescription: m.rewardDescription,
      rewardIcon: m.rewardIcon,
      status: m.status,
      currentProgress: m.currentProgress,
      achievedDate: m.achievedDate,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt
    }))

    return {
      success: true,
      data: formattedMilestones,
      stats,
      completedHistory
    }
  } catch (error: any) {
    console.error('Error fetching milestones:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch milestones'
    })
  }
})

