import { Frequency, CompletionStatus, FieldType, Category, Habit, MilestoneStatus } from '@prisma/client'
import prisma from '../lib/prisma'
import { DEFAULT_CATEGORIES } from '../server/utils/seedCategories'


declare const process: {
  env: {
    SEED_USER_ID?: string
  }
  exit: (code: number) => never
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Get a random number between min and max
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Get a random date between start and end
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

/**
 * Add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Get start of day
 */
function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Check if date is weekend
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

/**
 * Calculate next due date based on habit frequency
 */
function calculateNextDueDate(frequency: Frequency, currentDate: Date): Date {
  const nextDate = new Date(currentDate)
  
  switch (frequency) {
    case Frequency.daily:
      nextDate.setDate(nextDate.getDate() + 1)
      break
    case Frequency.weekly:
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case Frequency.monthly:
      nextDate.setMonth(nextDate.getMonth() + 1)
      break
    default:
      nextDate.setDate(nextDate.getDate() + 1)
  }
  
  return nextDate
}

/**
 * Create milestones for a habit
 */
async function createMilestonesForHabit(habit: Habit, userId: string) {
  const milestones = []
  const targetMetric = habit.goalMetric
  
  // Generate milestone templates based on habit type
  const milestoneTemplates: Array<{
    name: string
    description: string | null
    targetValue: number
    rewardName: string | null
    rewardDescription: string | null
    rewardIcon: string
  }> = []

  if (targetMetric === 'sessions') {
    // Create milestones at 10, 25, 50, 100 sessions
    milestoneTemplates.push(
      {
        name: '10 Sessions',
        description: 'Complete 10 sessions',
        targetValue: 10,
        rewardName: 'Small Win',
        rewardDescription: 'You\'re building momentum!',
        rewardIcon: '🎯'
      },
      {
        name: '25 Sessions',
        description: 'Complete 25 sessions',
        targetValue: 25,
        rewardName: 'Progress Maker',
        rewardDescription: 'You\'re making great progress!',
        rewardIcon: '⭐'
      },
      {
        name: '50 Sessions',
        description: 'Complete 50 sessions',
        targetValue: 50,
        rewardName: 'Halfway Hero',
        rewardDescription: 'You\'ve reached the halfway point!',
        rewardIcon: '🏆'
      },
      {
        name: '100 Sessions',
        description: 'Complete 100 sessions',
        targetValue: 100,
        rewardName: 'Century Club',
        rewardDescription: 'Amazing dedication!',
        rewardIcon: '👑'
      }
    )
  } else if (targetMetric === 'minutes' || targetMetric === 'hours') {
    // Create milestones based on time
    const baseValue = targetMetric === 'hours' ? habit.goalValue * 60 : habit.goalValue
    milestoneTemplates.push(
      {
        name: `${baseValue * 5} ${targetMetric === 'hours' ? 'Hours' : 'Minutes'}`,
        description: `Accumulate ${baseValue * 5} ${targetMetric === 'hours' ? 'hours' : 'minutes'}`,
        targetValue: targetMetric === 'hours' ? baseValue * 5 / 60 : baseValue * 5,
        rewardName: 'Time Builder',
        rewardDescription: 'You\'re investing in yourself!',
        rewardIcon: '⏰'
      },
      {
        name: `${baseValue * 10} ${targetMetric === 'hours' ? 'Hours' : 'Minutes'}`,
        description: `Accumulate ${baseValue * 10} ${targetMetric === 'hours' ? 'hours' : 'minutes'}`,
        targetValue: targetMetric === 'hours' ? baseValue * 10 / 60 : baseValue * 10,
        rewardName: 'Time Master',
        rewardDescription: 'Consistent time investment!',
        rewardIcon: '⏳'
      },
      {
        name: `${baseValue * 20} ${targetMetric === 'hours' ? 'Hours' : 'Minutes'}`,
        description: `Accumulate ${baseValue * 20} ${targetMetric === 'hours' ? 'hours' : 'minutes'}`,
        targetValue: targetMetric === 'hours' ? baseValue * 20 / 60 : baseValue * 20,
        rewardName: 'Time Champion',
        rewardDescription: 'Outstanding dedication!',
        rewardIcon: '💎'
      }
    )
  } else {
    // For other metrics (glasses, items, etc.)
    milestoneTemplates.push(
      {
        name: `${habit.goalValue * 10} ${targetMetric}`,
        description: `Reach ${habit.goalValue * 10} ${targetMetric}`,
        targetValue: habit.goalValue * 10,
        rewardName: 'Milestone Achiever',
        rewardDescription: 'Great progress!',
        rewardIcon: '🎉'
      },
      {
        name: `${habit.goalValue * 25} ${targetMetric}`,
        description: `Reach ${habit.goalValue * 25} ${targetMetric}`,
        targetValue: habit.goalValue * 25,
        rewardName: 'Progress Star',
        rewardDescription: 'You\'re on fire!',
        rewardIcon: '⭐'
      },
      {
        name: `${habit.goalValue * 50} ${targetMetric}`,
        description: `Reach ${habit.goalValue * 50} ${targetMetric}`,
        targetValue: habit.goalValue * 50,
        rewardName: 'Champion',
        rewardDescription: 'Incredible achievement!',
        rewardIcon: '🏆'
      }
    )
  }

  // Create milestones
  for (const template of milestoneTemplates) {
    const milestone = await prisma.habitMilestones.create({
      data: {
        habitId: habit.id,
        userId,
        name: template.name,
        description: template.description,
        targetValue: template.targetValue,
        targetMetric,
        rewardName: template.rewardName,
        rewardDescription: template.rewardDescription,
        rewardIcon: template.rewardIcon,
        status: MilestoneStatus.locked,
        currentProgress: 0
      }
    })
    milestones.push(milestone)
  }

  return milestones
}

/**
 * Update milestone progress (simulating API logic)
 */
async function updateMilestoneProgress(
  habitId: string, 
  value: number, 
  durationMinutes: number | null,
  targetMetric: string
) {
  const milestones = await prisma.habitMilestones.findMany({
    where: {
      habitId,
      status: { in: [MilestoneStatus.locked, MilestoneStatus.inProgress] }
    }
  })

  for (const milestone of milestones) {
    let progressIncrement = 0

    if (milestone.targetMetric === 'sessions') {
      progressIncrement = 1
    } else if (milestone.targetMetric === 'minutes' || milestone.targetMetric === 'hours') {
      progressIncrement = durationMinutes ? durationMinutes : 0
      if (milestone.targetMetric === 'hours') {
        progressIncrement = progressIncrement / 60
      }
    } else {
      progressIncrement = value
    }

    const newProgress = milestone.currentProgress + progressIncrement
    const isAchieved = newProgress >= milestone.targetValue

    const newStatus = isAchieved 
      ? MilestoneStatus.achieved 
      : (milestone.status === MilestoneStatus.locked && newProgress > 0)
        ? MilestoneStatus.inProgress
        : MilestoneStatus.inProgress

    await prisma.habitMilestones.update({
      where: { id: milestone.id },
      data: {
        currentProgress: newProgress,
        status: newStatus,
        achievedDate: isAchieved ? new Date() : milestone.achievedDate
      }
    })
  }
}

interface HabitTemplate {
  name: string
  description: string
  icon: string
  frequency: Frequency
  goalValue: number
  goalMetric: string
  customFields?: Array<{
    title: string
    type: FieldType
    options?: string[]
    placeholder?: string
    isRequired: boolean
  }>
}

const HABIT_TEMPLATES: Record<string, HabitTemplate[]> = {
  'Health & Fitness': [
    {
      name: 'Morning Run',
      description: 'Run for at least 30 minutes every morning',
      icon: '🏃',
      frequency: Frequency.daily,
      goalValue: 100,
      goalMetric: 'sessions',
      customFields: [
        { title: 'Distance (km)', type: FieldType.number, placeholder: 'Enter distance', isRequired: false },
        { title: 'Weather', type: FieldType.select, options: ['Sunny', 'Cloudy', 'Rainy', 'Cold'], isRequired: false }
      ]
    },
    {
      name: 'Gym Workout',
      description: 'Hit the gym for strength training',
      icon: '💪',
      frequency: Frequency.weekly,
      goalValue: 50,
      goalMetric: 'sessions',
      customFields: [
        { title: 'Workout Type', type: FieldType.select, options: ['Upper Body', 'Lower Body', 'Full Body', 'Cardio'], isRequired: false },
        { title: 'Duration (minutes)', type: FieldType.number, placeholder: 'Enter duration', isRequired: false }
      ]
    },
    {
      name: 'Drink Water',
      description: 'Drink 8 glasses of water daily',
      icon: '💧',
      frequency: Frequency.daily,
      goalValue: 1000,
      goalMetric: 'glasses',
      customFields: [
        { title: 'Amount (ml)', type: FieldType.number, placeholder: 'Enter amount', isRequired: false }
      ]
    },
    {
      name: 'Yoga Session',
      description: 'Practice yoga for flexibility and mindfulness',
      icon: '🧘',
      frequency: Frequency.weekly,
      goalValue: 50,
      goalMetric: 'sessions',
      customFields: [
        { title: 'Style', type: FieldType.select, options: ['Hatha', 'Vinyasa', 'Yin', 'Power'], isRequired: false },
        { title: 'Duration (minutes)', type: FieldType.number, placeholder: 'Enter duration', isRequired: false }
      ]
    }
  ],
  'Productivity': [
    {
      name: 'Deep Work Session',
      description: 'Focus on important tasks without distractions',
      icon: '🎯',
      frequency: Frequency.daily,
      goalValue: 150,
      goalMetric: 'sessions',
      customFields: [
        { title: 'Task Focus', type: FieldType.text, placeholder: 'What did you work on?', isRequired: false },
        { title: 'Duration (minutes)', type: FieldType.number, placeholder: 'Enter duration', isRequired: false }
      ]
    },
    {
      name: 'Review Daily Goals',
      description: 'Review and plan daily goals',
      icon: '📋',
      frequency: Frequency.daily,
      goalValue: 100,
      goalMetric: 'sessions'
    },
    {
      name: 'Email Management',
      description: 'Process and organize emails',
      icon: '📧',
      frequency: Frequency.daily,
      goalValue: 100,
      goalMetric: 'sessions',
      customFields: [
        { title: 'Emails Processed', type: FieldType.number, placeholder: 'Number of emails', isRequired: false }
      ]
    },
    {
      name: 'Weekly Planning',
      description: 'Plan the week ahead',
      icon: '📅',
      frequency: Frequency.weekly,
      goalValue: 50,
      goalMetric: 'sessions'
    }
  ],
  'Mindfulness': [
    {
      name: 'Meditation',
      description: 'Daily meditation practice',
      icon: '🧘‍♀️',
      frequency: Frequency.daily,
      goalValue: 100,
      goalMetric: 'sessions',
      customFields: [
        { title: 'Duration (minutes)', type: FieldType.number, placeholder: 'Enter duration', isRequired: false },
        { title: 'Type', type: FieldType.select, options: ['Guided', 'Unguided', 'Walking', 'Body Scan'], isRequired: false }
      ]
    },
    {
      name: 'Gratitude Journal',
      description: 'Write down things you are grateful for',
      icon: '🙏',
      frequency: Frequency.daily,
      goalValue: 300,
      goalMetric: 'items',
      customFields: [
        { title: 'Gratitude Items', type: FieldType.text, placeholder: 'What are you grateful for?', isRequired: false }
      ]
    },
    {
      name: 'Breathing Exercises',
      description: 'Practice breathing exercises for relaxation',
      icon: '🌬️',
      frequency: Frequency.daily,
      goalValue: 150,
      goalMetric: 'sessions',
      customFields: [
        { title: 'Duration (minutes)', type: FieldType.number, placeholder: 'Enter duration', isRequired: false }
      ]
    }
  ],
  'Learning': [
    {
      name: 'Read Books',
      description: 'Read for personal growth',
      icon: '📚',
      frequency: Frequency.daily,
      goalValue: 5000,
      goalMetric: 'minutes',
      customFields: [
        { title: 'Book Title', type: FieldType.text, placeholder: 'What are you reading?', isRequired: false },
        { title: 'Pages Read', type: FieldType.number, placeholder: 'Number of pages', isRequired: false }
      ]
    },
    {
      name: 'Online Course',
      description: 'Learn new skills through online courses',
      icon: '💻',
      frequency: Frequency.weekly,
      goalValue: 100,
      goalMetric: 'hours',
      customFields: [
        { title: 'Course Name', type: FieldType.text, placeholder: 'Which course?', isRequired: false },
        { title: 'Duration (minutes)', type: FieldType.number, placeholder: 'Enter duration', isRequired: false }
      ]
    },
    {
      name: 'Practice Coding',
      description: 'Practice programming skills',
      icon: '⌨️',
      frequency: Frequency.daily,
      goalValue: 200,
      goalMetric: 'hours',
      customFields: [
        { title: 'Language/Topic', type: FieldType.text, placeholder: 'What did you practice?', isRequired: false },
        { title: 'Duration (minutes)', type: FieldType.number, placeholder: 'Enter duration', isRequired: false }
      ]
    }
  ],
  'Social': [
    {
      name: 'Call Family',
      description: 'Stay connected with family members',
      icon: '👨‍👩‍👧‍👦',
      frequency: Frequency.weekly,
      goalValue: 50,
      goalMetric: 'calls',
      customFields: [
        { title: 'Who did you call?', type: FieldType.text, placeholder: 'Family member name', isRequired: false },
        { title: 'Duration (minutes)', type: FieldType.number, placeholder: 'Call duration', isRequired: false }
      ]
    },
    {
      name: 'Meet Friends',
      description: 'Spend quality time with friends',
      icon: '👥',
      frequency: Frequency.weekly,
      goalValue: 50,
      goalMetric: 'meetings'
    },
    {
      name: 'Send Appreciation',
      description: 'Send messages of appreciation',
      icon: '💌',
      frequency: Frequency.weekly,
      goalValue: 100,
      goalMetric: 'messages'
    }
  ],
  'Personal Care': [
    {
      name: 'Skincare Routine',
      description: 'Follow morning and evening skincare routine',
      icon: '✨',
      frequency: Frequency.daily,
      goalValue: 200,
      goalMetric: 'sessions',
      customFields: [
        { title: 'Time of Day', type: FieldType.select, options: ['Morning', 'Evening', 'Both'], isRequired: false }
      ]
    },
    {
      name: 'Healthy Meal Prep',
      description: 'Prepare healthy meals for the week',
      icon: '🥗',
      frequency: Frequency.weekly,
      goalValue: 50,
      goalMetric: 'sessions',
      customFields: [
        { title: 'Meals Prepared', type: FieldType.number, placeholder: 'Number of meals', isRequired: false }
      ]
    },
    {
      name: 'Quality Sleep',
      description: 'Get 7-8 hours of quality sleep',
      icon: '😴',
      frequency: Frequency.daily,
      goalValue: 100,
      goalMetric: 'sessions',
      customFields: [
        { title: 'Hours Slept', type: FieldType.number, placeholder: 'Enter hours', isRequired: false },
        { title: 'Sleep Quality', type: FieldType.select, options: ['Excellent', 'Good', 'Fair', 'Poor'], isRequired: false }
      ]
    }
  ]
}

async function clearDatabase(userId: string) {
  console.log(`\n🗑️  Clearing existing data for user: ${userId}...`)

  try {
    const userHabits = await prisma.habit.findMany({
      where: { userId },
      select: { id: true }
    })
    const habitIds = userHabits.map(({ id }: { id: string }) => id)

    const deletedLogs = await prisma.habitLogs.deleteMany({
      where: { userId }
    })
    console.log(`  ✓ Deleted ${deletedLogs.count} habit logs`)

    const deletedCustomFields = await prisma.habitCustomField.deleteMany({
      where: { habitId: { in: habitIds } }
    })
    console.log(`  ✓ Deleted ${deletedCustomFields.count} custom fields`)

    const deletedMilestones = await prisma.habitMilestones.deleteMany({
      where: { userId }
    })
    console.log(`  ✓ Deleted ${deletedMilestones.count} milestones`)

    const deletedNotifications = await prisma.notifications.deleteMany({
      where: { userId }
    })
    console.log(`  ✓ Deleted ${deletedNotifications.count} notifications`)

    const deletedHabits = await prisma.habit.deleteMany({
      where: { userId }
    })
    console.log(`  ✓ Deleted ${deletedHabits.count} habits`)

    const deletedCategories = await prisma.category.deleteMany({
      where: { userId }
    })
    console.log(`  ✓ Deleted ${deletedCategories.count} categories`)

    const deletedAchievements = await prisma.achievements.deleteMany({
      where: { userId }
    })
    console.log(`  ✓ Deleted ${deletedAchievements.count} achievements`)

    console.log('  ✅ Database cleared successfully\n')
  } catch (error) {
    console.error('  ❌ Error clearing database:', error)
    throw error
  }
}

async function seedData(userId: string) {
  console.log(`Starting seed for user: ${userId}`)

  await clearDatabase(userId)

  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(now)
  todayEnd.setHours(23, 59, 59, 999) // End of today
  
  const threeMonthsAgo = new Date(now)
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  threeMonthsAgo.setHours(0, 0, 0, 0)

  console.log(`Date range: ${threeMonthsAgo.toISOString()} to ${now.toISOString()}`)

  console.log('\n📁 Creating categories...')
  const categories: Category[] = []
  for (const categoryData of DEFAULT_CATEGORIES) {
    const category = await prisma.category.create({
      data: {
        ...categoryData,
        userId,
        isActive: true
      }
    })
    categories.push(category)
    console.log(`  ✓ Created category: ${category.name}`)
  }

  console.log('\n🎯 Creating habits...')
  const habits: Habit[] = []
  for (const category of categories) {
    const templates = HABIT_TEMPLATES[category.name] || []
    for (const template of templates) {
      const habit = await prisma.habit.create({
        data: {
          name: template.name,
          description: template.description,
          icon: template.icon,
          frequency: template.frequency,
          goalValue: template.goalValue,
          goalMetric: template.goalMetric,
          timeOfDay: `${randomInt(6, 22)}:00`,
          initialValue: 0,
          difficultyRate: randomInt(1, 5),
          status: 'active',
          isArchived: false,
          userId,
          categoryId: category.id,
          enableNotifications: Math.random() > 0.3,
          totalCompletions: 0,
          totalMissed: 0,
          totalSkipped: 0,
          currentStreak: 0,
          longestStreak: 0
        }
      })

      if (template.customFields && template.customFields.length > 0) {
        for (let i = 0; i < template.customFields.length; i++) {
          const field = template.customFields[i]
          await prisma.habitCustomField.create({
            data: {
              habitId: habit.id,
              title: field.title,
              type: field.type,
              options: field.options ? field.options : [],
              placeholder: field.placeholder || null,
              isRequired: field.isRequired,
              sortingOrder: i
            }
          })
        }
      }

      habits.push(habit)
      console.log(`  ✓ Created habit: ${habit.name} (${category.name})`)
    }
  }

  console.log('\n🏆 Creating milestones...')
  let totalMilestones = 0
  for (const habit of habits) {
    const milestones = await createMilestonesForHabit(habit, userId)
    totalMilestones += milestones.length
    console.log(`  ✓ Created ${milestones.length} milestones for ${habit.name}`)
  }
  console.log(`  ✅ Total milestones created: ${totalMilestones}`)

  console.log('\n📊 Generating habit logs for past 3 months...')
  let totalLogs = 0

  // Generate some "complete miss days" where all habits are missed
  const completeMissDays = new Set<number>()
  const daysInRange = Math.ceil((now.getTime() - threeMonthsAgo.getTime()) / (1000 * 60 * 60 * 24))
  const numCompleteMissDays = Math.floor(daysInRange * 0.05) // ~5% of days are complete miss days
  
  for (let i = 0; i < numCompleteMissDays; i++) {
    const randomDay = Math.floor(Math.random() * daysInRange)
    completeMissDays.add(randomDay)
  }
  console.log(`  📅 Generated ${completeMissDays.size} complete miss days`)

  for (const habit of habits) {
    // Initialize habit statistics
    let currentStreak = 0
    let longestStreak = 0
    let totalCompletions = 0
    let totalMissed = 0
    let totalSkipped = 0
    let nextDueDate: Date | null = null
    const recentMisses: Date[] = [] // Track recent misses for milestone locking

    const startDate = new Date(threeMonthsAgo)
    const endDate = new Date(now) // Use current time as end date

    // Get custom fields for this habit (once)
    const customFieldDefs = await prisma.habitCustomField.findMany({
      where: { habitId: habit.id }
    })

    if (habit.frequency === Frequency.daily) {
      let currentDate = new Date(startDate)
      let dayIndex = 0

      while (currentDate <= endDate) {
        const dateStart = startOfDay(currentDate)
        
        // Check if this is a complete miss day
        const isCompleteMissDay = completeMissDays.has(dayIndex)
        
        // On complete miss days, all habits are missed
        const shouldComplete = isCompleteMissDay ? false : Math.random() > 0.15 // 85% completion rate
        const isMissed = isCompleteMissDay ? true : Math.random() < 0.1 // 10% missed
        const isSkipped = isCompleteMissDay ? false : Math.random() < 0.05 // 5% skipped

        let status: CompletionStatus = CompletionStatus.completed
        if (isMissed) {
          status = CompletionStatus.missed
          currentStreak = 0
          totalMissed++
          recentMisses.push(new Date(currentDate))
          // Keep only last 3 misses
          if (recentMisses.length > 3) {
            recentMisses.shift()
          }
          // Check for 3 consecutive misses and lock milestones
          if (recentMisses.length === 3) {
            const lastThreeDates = recentMisses.slice(-3)
            const isConsecutive = lastThreeDates.every((date, idx) => {
              if (idx === 0) return true
              const prevDate = lastThreeDates[idx - 1]
              const daysDiff = Math.floor((date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
              return daysDiff === 1
            })
            if (isConsecutive) {
              await prisma.habitMilestones.updateMany({
                where: {
                  habitId: habit.id,
                  status: { in: [MilestoneStatus.inProgress, MilestoneStatus.achieved] }
                },
                data: {
                  status: MilestoneStatus.locked
                }
              })
            }
          }
        } else if (isSkipped) {
          status = CompletionStatus.skipped
          currentStreak = 0
          totalSkipped++
        } else if (shouldComplete) {
          status = Math.random() > 0.1 ? CompletionStatus.completed : CompletionStatus.partial
          if (status === CompletionStatus.completed || status === CompletionStatus.partial) {
            currentStreak++
            longestStreak = Math.max(longestStreak, currentStreak)
            // Only increment totalCompletions when status is completed
            if (status === CompletionStatus.completed) {
              totalCompletions++
            }
            nextDueDate = calculateNextDueDate(habit.frequency, currentDate)
            
            // Update milestones
            const durationMinutes = Math.random() > 0.3 ? randomInt(10, 120) : null
            await updateMilestoneProgress(habit.id, habit.goalValue, durationMinutes, habit.goalMetric)
          }
        } else {
          currentDate = addDays(currentDate, 1)
          continue
        }

        // Generate log entry - ensure it doesn't exceed current time
        const dateEnd = addDays(dateStart, 1)
        const maxDate = dateEnd > now ? now : dateEnd
        const logTime = randomDate(dateStart, maxDate)
        const customFields: any = {}

        for (const fieldDef of customFieldDefs) {
          if (fieldDef.type === FieldType.number) {
            customFields[fieldDef.title] = randomInt(1, 100)
          } else if (fieldDef.type === FieldType.text) {
            customFields[fieldDef.title] = `Sample ${fieldDef.title.toLowerCase()}`
          } else if (fieldDef.type === FieldType.select && fieldDef.options) {
            const options = fieldDef.options as string[]
            customFields[fieldDef.title] = randomElement(options)
          } else if (fieldDef.type === FieldType.boolean) {
            customFields[fieldDef.title] = Math.random() > 0.5
          }
        }

        const durationMinutes = Math.random() > 0.3 ? randomInt(10, 120) : null

        // Create log entry
        await prisma.habitLogs.create({
          data: {
            habitId: habit.id,
            userId,
            completionStatus: status,
            value: status === CompletionStatus.completed || status === CompletionStatus.partial ? habit.goalValue : Math.floor(habit.goalValue * 0.5),
            durationMinutes,
            notes: Math.random() > 0.7 ? `Log entry for ${dateStart.toLocaleDateString()}` : null,
            customFields: Object.keys(customFields).length > 0 ? customFields : null,
            createdAt: logTime
          }
        })
        totalLogs++

        currentDate = addDays(currentDate, 1)
        dayIndex++
      }

    } else if (habit.frequency === Frequency.weekly) {
      let currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        // For weekly habits, check if any day in this week is a complete miss day
        const weekStartDay = Math.floor((currentDate.getTime() - threeMonthsAgo.getTime()) / (1000 * 60 * 60 * 24))
        const hasCompleteMissDay = Array.from({ length: 7 }, (_, i) => weekStartDay + i)
          .some(day => completeMissDays.has(day))
        
        const shouldComplete = hasCompleteMissDay ? false : Math.random() > 0.2 // 80% completion rate
        const isMissed = hasCompleteMissDay ? true : Math.random() < 0.1
        const isSkipped = hasCompleteMissDay ? false : Math.random() < 0.05

        let status: CompletionStatus = CompletionStatus.completed
        if (isMissed) {
          status = CompletionStatus.missed
          currentStreak = 0
          totalMissed++
          recentMisses.push(new Date(currentDate))
          if (recentMisses.length > 3) {
            recentMisses.shift()
          }
          // Check for 3 consecutive weekly misses
          if (recentMisses.length === 3) {
            const lastThreeDates = recentMisses.slice(-3)
            const isConsecutive = lastThreeDates.every((date, idx) => {
              if (idx === 0) return true
              const prevDate = lastThreeDates[idx - 1]
              const daysDiff = Math.floor((date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
              return daysDiff >= 6 && daysDiff <= 8 // Allow 6-8 days for weekly
            })
            if (isConsecutive) {
              await prisma.habitMilestones.updateMany({
                where: {
                  habitId: habit.id,
                  status: { in: [MilestoneStatus.inProgress, MilestoneStatus.achieved] }
                },
                data: {
                  status: MilestoneStatus.locked
                }
              })
            }
          }
        } else if (isSkipped) {
          status = CompletionStatus.skipped
          currentStreak = 0
          totalSkipped++
        } else if (shouldComplete) {
          status = Math.random() > 0.1 ? CompletionStatus.completed : CompletionStatus.partial
          if (status === CompletionStatus.completed || status === CompletionStatus.partial) {
            currentStreak++
            longestStreak = Math.max(longestStreak, currentStreak)
            // Only increment totalCompletions when status is completed
            if (status === CompletionStatus.completed) {
              totalCompletions++
            }
            nextDueDate = calculateNextDueDate(habit.frequency, currentDate)
            
            // Generate 1-3 log entries for this week
            const numLogs = randomInt(1, Math.min(3, habit.goalValue))
            for (let i = 0; i < numLogs; i++) {
              // Ensure log date doesn't exceed current time
              const weekEnd = addDays(currentDate, 6)
              const maxLogDate = weekEnd > now ? now : weekEnd
              const logDate = randomDate(currentDate, maxLogDate)
              
              // Ensure log time doesn't exceed current time
              const dayStart = startOfDay(logDate)
              const dayEnd = addDays(dayStart, 1)
              const maxTime = dayEnd > now ? now : dayEnd
              const logTime = randomDate(dayStart, maxTime)
              const durationMinutes = Math.random() > 0.3 ? randomInt(15, 180) : null

              const customFields: any = {}
              for (const fieldDef of customFieldDefs) {
                if (fieldDef.type === FieldType.number) {
                  customFields[fieldDef.title] = randomInt(1, 100)
                } else if (fieldDef.type === FieldType.text) {
                  customFields[fieldDef.title] = `Sample ${fieldDef.title.toLowerCase()}`
                } else if (fieldDef.type === FieldType.select && fieldDef.options) {
                  const options = fieldDef.options as string[]
                  customFields[fieldDef.title] = randomElement(options)
                } else if (fieldDef.type === FieldType.boolean) {
                  customFields[fieldDef.title] = Math.random() > 0.5
                }
              }

              await prisma.habitLogs.create({
                data: {
                  habitId: habit.id,
                  userId,
                  completionStatus: status,
                  value: habit.goalValue,
                  durationMinutes,
                  notes: Math.random() > 0.7 ? `Weekly log entry` : null,
                  customFields: Object.keys(customFields).length > 0 ? customFields : null,
                  createdAt: logTime
                }
              })
              totalLogs++

              // Update milestones for each log
              await updateMilestoneProgress(habit.id, habit.goalValue, durationMinutes, habit.goalMetric)
            }
          }
        }

        currentDate = addDays(currentDate, 7)
      }
    }

    // Update habit with final statistics
    await prisma.habit.update({
      where: { id: habit.id },
      data: {
        totalCompletions,
        totalMissed,
        totalSkipped,
        longestStreak,
        currentStreak,
        nextDueDate
      }
    })

    console.log(`  ✓ Generated logs for ${habit.name} (streak: ${currentStreak}, completions: ${totalCompletions})`)
  }

  console.log(`\n✅ Seed completed!`)
  console.log(`   Categories: ${categories.length}`)
  console.log(`   Habits: ${habits.length}`)
  console.log(`   Milestones: ${totalMilestones}`)
  console.log(`   Total Logs: ${totalLogs}`)
  console.log(`   Complete Miss Days: ${completeMissDays.size}`)
}

// Main execution
async function main() {
  const userId = process.env.SEED_USER_ID

  if (!userId) {
    console.error('❌ Error: SEED_USER_ID environment variable is required')
    console.error('   Usage: SEED_USER_ID=<user-id> pnpm tsx scripts/seed-data.ts')
    process.exit(1)
  }

  try {
    await seedData(userId)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

