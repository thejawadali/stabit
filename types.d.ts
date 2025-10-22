import type { CountUnit, GoalFrequency, Theme, TimeUnit, TrackingType, UserProfile } from "@prisma/client"

interface Habit {
  id: string;
  name: string;
  icon: string;
  time?: string;
  status?: "done" | "pending";
  category?: string;
  progress?: number;
  streak?: number;
  trend?: number[];
  missedDate?: string;
}

interface Activity {
  id: string;
  habit: string;
  value: string;
  timestamp: string;
  icon: string;
}

interface Milestone {
  id: string;
  habit: string;
  icon: string;
  nextMilestone: string;
  progress: number;
  daysRemaining: number;
}


// type UserProfileType = Omit<UserProfile, 'userId'|'createdAt'|'updatedAt'|'timezone'|'isActive'>;

type ProfileInfoType = Pick<UserProfile, 'name'|'email'|'avatarUrl'|'age'|'height'|'gender'|'personalGoals'|'preferredTimeUnits'|'preferredCountUnits'|'defaultReminderTime'|'defaultTrackingType'|'defaultGoalFrequency'|'theme'>;

type GeneralSettingsType = Pick<UserProfile, 'language'|'dateFormat'|'autoSync'|'lastSyncTime'|'defaultDashboardView'|'showWelcomeMessage'>;
