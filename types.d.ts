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