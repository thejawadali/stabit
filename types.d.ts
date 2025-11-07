import type { CountUnit, GoalFrequency, Theme, TimeUnit, TrackingType, UserProfile, Category, Habit } from "@prisma/client"


interface Activity {
  id: string
  habit: string
  value: string
  timestamp: string
  icon: string
}

interface Milestone {
  id: string
  habit: string
  icon: string
  nextMilestone: string
  progress: number
  daysRemaining: number
}



type ProfileInfoType = Pick<UserProfile, 'name' | 'email' | 'avatarUrl' | 'age' | 'height' | 'gender' | 'personalGoals' | 'preferredTimeUnits' | 'preferredCountUnits' | 'defaultReminderTime' | 'defaultTrackingType' | 'defaultGoalFrequency' | 'theme'>

type GeneralSettingsType = Pick<UserProfile, 'language' | 'dateFormat' | 'autoSync' | 'lastSyncTime' | 'defaultDashboardView' | 'showWelcomeMessage' | 'notificationsEnabled'>

type NotificationSettingsType = Pick<UserProfile, 'enableReminders' | 'enableMilestones' | 'enableStreaks' | 'defaultReminderTime' | 'reminderTone' | 'smartReminders' | 'inAppNotifications' | 'emailNotifications' | 'pushNotifications' | 'quietHoursEnabled' | 'quietHoursStart' | 'quietHoursEnd' | 'snoozeDuration' | 'isSnoozed' | 'snoozeUntil'> & {
  quietHoursDays: string[]
}


type Category = Pick<Category, 'name' | 'description' | 'color' | 'icon' | 'isActive' | 'userId' | 'createdAt'> & {
  id: string
  habitsCount: number
}

type HabitFormData = {
  name: string
  categoryId: string
  description?: string
  icon?: string
  frequency?: string
  timeOfDay?: string
  initialValue?: number
  difficultyRate?: number
  goalValue?: number
  goalMetric?: string
  estimatedCompletionDate?: Date
  enableNotifications?: boolean
  reminderTimes?: string[]
}

type Habit = Omit<Habit>