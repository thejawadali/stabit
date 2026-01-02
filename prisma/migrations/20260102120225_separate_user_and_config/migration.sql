-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('streak', 'completion', 'consistency', 'milestone', 'special');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('reminder', 'streakBreak', 'milestoneAchieved', 'encouragement', 'system');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('locked', 'inProgress', 'achieved');

-- CreateEnum
CREATE TYPE "CompletionStatus" AS ENUM ('completed', 'partial', 'missed', 'skipped');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('light', 'dark', 'system');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "TimeUnit" AS ENUM ('minutes', 'hours');

-- CreateEnum
CREATE TYPE "CountUnit" AS ENUM ('repetitions', 'sessions', 'times', 'items');

-- CreateEnum
CREATE TYPE "TrackingType" AS ENUM ('duration', 'count', 'both');

-- CreateEnum
CREATE TYPE "GoalFrequency" AS ENUM ('daily', 'weekly', 'monthly');

-- CreateEnum
CREATE TYPE "DashboardView" AS ENUM ('overview', 'analytics', 'calendar', 'progress');

-- CreateEnum
CREATE TYPE "ReminderTone" AS ENUM ('gentle', 'motivational', 'energetic', 'calm', 'custom');

-- CreateEnum
CREATE TYPE "SnoozeDuration" AS ENUM ('fifteenMinutes', 'oneHour', 'twoHours', 'fourHours', 'eightHours', 'twentyFourHours');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('daily', 'weekly', 'monthly');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('text', 'number', 'select', 'boolean');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "age" INTEGER NOT NULL DEFAULT 0,
    "gender" "Gender" NOT NULL DEFAULT 'male',
    "height" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configs" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'UTC',
    "theme" "Theme" NOT NULL DEFAULT 'system',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "personalGoals" TEXT NOT NULL DEFAULT '',
    "preferredTimeUnits" "TimeUnit" NOT NULL DEFAULT 'minutes',
    "preferredCountUnits" "CountUnit" NOT NULL DEFAULT 'repetitions',
    "defaultTrackingType" "TrackingType" NOT NULL DEFAULT 'duration',
    "defaultGoalFrequency" "GoalFrequency" NOT NULL DEFAULT 'daily',
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "enableReminders" BOOLEAN NOT NULL DEFAULT true,
    "enableMilestones" BOOLEAN NOT NULL DEFAULT true,
    "enableStreaks" BOOLEAN NOT NULL DEFAULT true,
    "defaultReminderTime" VARCHAR(20) DEFAULT '23:00 PM',
    "reminderTone" "ReminderTone" NOT NULL DEFAULT 'gentle',
    "smartReminders" BOOLEAN NOT NULL DEFAULT true,
    "inAppNotifications" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "quietHoursEnabled" BOOLEAN NOT NULL DEFAULT false,
    "quietHoursStart" VARCHAR(10),
    "quietHoursEnd" VARCHAR(10),
    "quietHoursDays" JSONB,
    "snoozeDuration" "SnoozeDuration" NOT NULL DEFAULT 'oneHour',
    "isSnoozed" BOOLEAN NOT NULL DEFAULT false,
    "snoozeUntil" TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    "icon" VARCHAR(50),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habits" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" VARCHAR(50) NOT NULL DEFAULT '🎯',
    "frequency" "Frequency" NOT NULL DEFAULT 'daily',
    "timeOfDay" VARCHAR(10) NOT NULL DEFAULT '19:00',
    "initialValue" INTEGER NOT NULL DEFAULT 0,
    "difficultyRate" INTEGER NOT NULL DEFAULT 1,
    "goalValue" INTEGER NOT NULL DEFAULT 0,
    "goalMetric" VARCHAR(50) NOT NULL DEFAULT 'sessions',
    "currentTargetValue" INTEGER NOT NULL DEFAULT 0,
    "estimatedCompletionDate" DATE,
    "nextDueDate" DATE,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "userId" VARCHAR(36) NOT NULL,
    "categoryId" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enableNotifications" BOOLEAN NOT NULL DEFAULT true,
    "reminderTimes" JSONB,
    "totalCompletions" INTEGER NOT NULL DEFAULT 0,
    "totalMissed" INTEGER NOT NULL DEFAULT 0,
    "totalSkipped" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_custom_fields" (
    "id" TEXT NOT NULL,
    "habitId" VARCHAR(36) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" "FieldType" NOT NULL,
    "options" JSONB,
    "placeholder" VARCHAR(255),
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "sortingOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habit_custom_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_logs" (
    "id" TEXT NOT NULL,
    "habitId" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "completionStatus" "CompletionStatus" NOT NULL DEFAULT 'completed',
    "value" INTEGER NOT NULL,
    "durationMinutes" INTEGER,
    "notes" TEXT,
    "customFields" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_milestones" (
    "id" TEXT NOT NULL,
    "habitId" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "targetMetric" VARCHAR(50) NOT NULL DEFAULT 'sessions',
    "rewardName" VARCHAR(255),
    "rewardDescription" TEXT,
    "rewardIcon" VARCHAR(50) NOT NULL DEFAULT '🎉',
    "status" "MilestoneStatus" NOT NULL DEFAULT 'locked',
    "currentProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "achievedDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habit_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "habitId" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'reminder',
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP NOT NULL,
    "readAt" TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(50) NOT NULL DEFAULT '🏆',
    "category" "AchievementCategory" NOT NULL DEFAULT 'streak',
    "criteria" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "configs_userId_key" ON "configs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_providerId_accountId_key" ON "accounts"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_identifier_value_key" ON "verifications"("identifier", "value");

-- CreateIndex
CREATE UNIQUE INDEX "habits_name_userId_key" ON "habits"("name", "userId");

-- CreateIndex
CREATE INDEX "habit_milestones_name_idx" ON "habit_milestones"("name");

-- AddForeignKey
ALTER TABLE "configs" ADD CONSTRAINT "configs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_custom_fields" ADD CONSTRAINT "habit_custom_fields_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_milestones" ADD CONSTRAINT "habit_milestones_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
