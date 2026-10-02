export type GoalCategory =
  | 'FITNESS'
  | 'LEARNING'
  | 'CAREER'
  | 'HEALTH'
  | 'PRODUCTIVITY'
  | 'MINDFULNESS'
  | 'PERSONAL'
  | 'CUSTOM';

export type TaskType =
  | 'DAILY_HABIT'
  | 'RECURRING_TASK'
  | 'WEEKLY_GOAL'
  | 'ONE_TIME_TODO'
  | 'NUMERICAL_GOAL';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  goalCategory: GoalCategory;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  dailyMinimum: number; // default 4
  notificationsEnabled: boolean;
  motivationalNotifications: boolean;
  reminderTime: string;
  weekendMode: boolean;
  streakFreezeEnabled: boolean;
  theme: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: TaskType;
  category: GoalCategory;
  icon: string;
  targetValue: number;
  unit: string;
  points: number;
  reminderEnabled: boolean;
  reminderTime?: string;
  isActive: boolean;
  isCompletedToday?: boolean;
}

export interface DailySummary {
  id: string;
  date: string; // YYYY-MM-DD
  tasksAssigned: number;
  tasksCompleted: number;
  completionRate: number;
  goalMet: boolean; // tasksCompleted >= dailyMinimum (4)
  xpEarned: number;
  streakStatus: number;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  targetCount: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetCount: number;
  xpReward: number;
  startDate: string;
  endDate: string;
  icon: string;
  isJoined?: boolean;
}

export interface DisciplineScoreData {
  disciplineScore: number;
  components: {
    goalSuccessRate: number;
    completionRate: number;
    streakConsistency: number;
    currentStreak: number;
  };
  formula: string;
}

export interface MatrixDay {
  date: string;
  label: string;
  dayNum: number;
  isToday: boolean;
}

export interface MatrixTask extends Task {
  completions: Record<string, boolean>;
}

