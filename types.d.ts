// Types
type Theme = 'light' | 'dark' | 'system'
type Gender = 'male' | 'female' | 'other'
type TimeUnit = 'minutes' | 'hours'
type CountUnit = 'repetitions' | 'sessions' | 'times' | 'items'
type TrackingType = 'duration' | 'count' | 'both'
type GoalFrequency = 'daily' | 'weekly' | 'monthly'
type Frequency = 'daily' | 'weekly' | 'monthly'
type DashboardView = 'overview' | 'analytics' | 'calendar' | 'progress'
type ReminderTone = 'gentle' | 'motivational' | 'energetic' | 'calm' | 'custom'
type SnoozeDuration = 'fifteenMinutes' | 'oneHour' | 'twoHours' | 'fourHours' | 'eightHours' | 'twentyFourHours'
type FieldType = 'text' | 'number' | 'select' | 'boolean'
type MilestoneStatus = 'locked' | 'inProgress' | 'achieved'
type CompletionStatus = 'completed' | 'partial' | 'missed' | 'skipped'
type NotificationType = 'reminder' | 'streakBreak' | 'milestoneAchieved' | 'encouragement' | 'system'
type AchievementCategory = 'streak' | 'completion' | 'consistency' | 'milestone' | 'special'



// Activity & Dashboard Types
interface Activity {
  id: string
  habit: string
  value: string
  timestamp: string
  icon: string
}

// Habit Types
interface Habit {
  id: string
  name: string
  description: string
  icon: string
  frequency: Frequency
  timeOfDay: string
  initialValue: number
  difficultyRate: number
  goalValue: number
  goalMetric: string
  estimatedCompletionDate: Date | null
  nextDueDate: Date | null
  isCompleted: boolean
  isArchived: boolean
  userId: string
  categoryId: string
  createdAt: Date
  updatedAt: Date
  enableNotifications: boolean
  reminderTimes: any | null
  totalCompletions: number
  totalMissed: number
  totalSkipped: number
  currentStreak: number
  longestStreak: number
}

interface TodayHabit extends Partial<Habit> {
  category: {
    id: string
    name: string
    icon: string
  }
}

interface HabitWithCategory extends Habit {
  category: {
    id: string
    name: string
    icon: string
  }
  mostRecentLog?: {
    id: string
    completionStatus: string
    createdAt: string
  } | null
}

interface MissedHabitLogs extends Partial<Habit> {
  id: string,
  createdAt: string,
  habit: {
    id: string
    name: string
    icon: string
  }
}

type HabitDetail = Pick<Habit, 'id' | 'name' | 'description' | 'icon' | 'currentStreak' | 'longestStreak' | 'totalCompletions' | 'status' | 'currentGoal' | 'category' | 'frequency' | 'createdAt'>

interface HabitLog {
  id: string
  createdAt: string
  completionStatus: string
  durationMinutes?: number
  notes?: string
}

type HabitListItem = Pick<Habit, 'id' | 'name' | 'icon'>


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



// Custom Field Types
type CustomField = {
  id: string
  title: string
  type: "text" | "number" | "select" | "boolean"
  options?: string[]
  placeholder?: string
  required: boolean
}




// Category Types
interface Category {
  id: string
  name: string
  description: string | null
  color: string
  icon: string | null
  isActive: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
  habitsCount: number
}




// User Profile & Settings Types
interface UserProfile {
  userId: string
  name: string
  email: string
  avatarUrl: string
  timezone: string
  language: string
  dateFormat: string
  theme: Theme
  age: number
  gender: Gender
  height: number
  isActive: boolean
  personalGoals: string
  preferredTimeUnits: TimeUnit
  preferredCountUnits: CountUnit
  defaultTrackingType: TrackingType
  defaultGoalFrequency: GoalFrequency
  autoSync: boolean
  lastSyncTime: Date | null
  defaultDashboardView: DashboardView
  showWelcomeMessage: boolean
  notificationsEnabled: boolean
  enableReminders: boolean
  enableMilestones: boolean
  enableStreaks: boolean
  defaultReminderTime: string | null
  reminderTone: ReminderTone
  smartReminders: boolean
  inAppNotifications: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  quietHoursEnabled: boolean
  quietHoursStart: string | null
  quietHoursEnd: string | null
  quietHoursDays: any | null
  snoozeDuration: SnoozeDuration
  isSnoozed: boolean
  snoozeUntil: Date | null
  createdAt: Date
  updatedAt: Date
}

type ProfileInfoType = Pick<UserProfile, 'name' | 'email' | 'avatarUrl' | 'age' | 'height' | 'gender' | 'personalGoals' | 'preferredTimeUnits' | 'preferredCountUnits' | 'defaultReminderTime' | 'defaultTrackingType' | 'defaultGoalFrequency' | 'theme'>

type GeneralSettingsType = Pick<UserProfile, 'language' | 'dateFormat' | 'autoSync' | 'lastSyncTime' | 'defaultDashboardView' | 'showWelcomeMessage' | 'notificationsEnabled'>

type NotificationSettingsType = Pick<UserProfile, 'enableReminders' | 'enableMilestones' | 'enableStreaks' | 'defaultReminderTime' | 'reminderTone' | 'smartReminders' | 'inAppNotifications' | 'emailNotifications' | 'pushNotifications' | 'quietHoursEnabled' | 'quietHoursStart' | 'quietHoursEnd' | 'snoozeDuration' | 'isSnoozed' | 'snoozeUntil'> & {
  quietHoursDays: string[]
}



// Milestone Types
interface Milestone {
  id: string
  habitId: string
  habitName: string
  habitIcon: string
  name: string
  description: string | null
  targetValue: number
  targetMetric: string
  currentProgress: number
  status: "locked" | "inProgress" | "achieved"
  rewardName: string | null
  rewardDescription: string | null
  rewardIcon: string
  achievedDate: string | null
  createdAt: string
  updatedAt: string
}

interface DashboardMilestone extends Partial<Milestone> {
  remainingSessions: number
}

interface MilestoneStats {
  achieved: number
  inProgress: number
  locked: number
  totalRewards: number
}

interface CompletedReward {
  id: string
  habitId: string
  habitName: string
  habitIcon: string
  milestoneName: string
  milestoneDescription: string | null
  rewardName: string | null
  rewardDescription: string | null
  rewardIcon: string
  achievedDate: string | null
  targetValue: number
  targetMetric: string
}

// Recent Logs Types
interface RecentLog {
  id: string
  habit: {
    id: string
    name: string
    icon: string
    goalMetric: string
  }
  completionStatus: string
  value: number
  createdAt: string
}