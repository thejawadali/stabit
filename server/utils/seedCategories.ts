import { PrismaClient } from '@prisma/client'

export interface DefaultCategory {
  name: string
  description: string
  color: string
  icon: string
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  {
    name: 'Health & Fitness',
    description: 'Physical health, exercise, and wellness habits',
    color: '#10B981',
    icon: '💪'
  },
  {
    name: 'Productivity',
    description: 'Work, learning, and productivity habits',
    color: '#3B82F6',
    icon: '⚡'
  },
  {
    name: 'Mindfulness',
    description: 'Meditation, reflection, and mental wellness',
    color: '#8B5CF6',
    icon: '🧘'
  },
  {
    name: 'Learning',
    description: 'Reading, studying, and skill development',
    color: '#F59E0B',
    icon: '📚'
  },
  {
    name: 'Social',
    description: 'Relationships, communication, and social activities',
    color: '#EF4444',
    icon: '👥'
  },
  {
    name: 'Personal Care',
    description: 'Self-care, hygiene, and personal maintenance',
    color: '#EC4899',
    icon: '✨'
  }
]

export async function seedDefaultCategories(prisma: PrismaClient, userId: string): Promise<void> {
  try {
    // Check if user already has categories
    const existingCategories = await prisma.category.findFirst({
      where: { userId }
    })

    // If user already has categories, don't seed
    if (existingCategories) {
      console.log(`User ${userId} already has categories, skipping seed`)
      return
    }

    // Create default categories for the user
    const categoriesToCreate = DEFAULT_CATEGORIES.map(category => ({
      ...category,
      userId,
      isActive: true
    }))

    await prisma.category.createMany({
      data: categoriesToCreate
    })

  } catch (error) {
    console.error('Error seeding default categories:', error)
    throw error
  }
}
