/*
  Warnings:

  - You are about to alter the column `lastSyncTime` on the `UserProfile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `snoozeUntil` on the `UserProfile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the column `color` on the `habits` table. All the data in the column will be lost.
  - Made the column `description` on table `habits` required. This step will fail if there are existing NULL values in that column.
  - Made the column `icon` on table `habits` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `UserProfile` MODIFY `personalGoals` TEXT NOT NULL DEFAULT '',
    MODIFY `lastSyncTime` TIMESTAMP NULL,
    MODIFY `snoozeUntil` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `habits` DROP COLUMN `color`,
    ADD COLUMN `difficultyRate` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `enableNotifications` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `estimatedCompletionDate` DATE NULL,
    ADD COLUMN `goalMetric` VARCHAR(50) NOT NULL DEFAULT 'sessions',
    ADD COLUMN `goalValue` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `initialValue` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `isArchived` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `recurrenceType` ENUM('daily', 'weekly', 'monthly') NOT NULL DEFAULT 'daily',
    ADD COLUMN `reminderTimes` JSON NULL,
    ADD COLUMN `status` ENUM('active', 'inactive', 'completed', 'paused') NOT NULL DEFAULT 'active',
    ADD COLUMN `timeOfDay` VARCHAR(10) NOT NULL DEFAULT '19:00',
    MODIFY `description` TEXT NOT NULL DEFAULT '',
    MODIFY `icon` VARCHAR(50) NOT NULL DEFAULT '🎯';

-- CreateTable
CREATE TABLE `habit_custom_fields` (
    `id` VARCHAR(191) NOT NULL,
    `habitId` VARCHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `fieldType` ENUM('text', 'number', 'select', 'boolean') NOT NULL,
    `options` JSON NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT false,
    `sortingOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habit_rewards` (
    `id` VARCHAR(191) NOT NULL,
    `milestoneValue` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `icon` VARCHAR(50) NOT NULL DEFAULT '🏆',
    `sortingOrder` INTEGER NOT NULL DEFAULT 0,
    `habitId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `habitId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `logDate` DATE NOT NULL,
    `completionStatus` ENUM('completed', 'partial', 'missed', 'skipped') NOT NULL DEFAULT 'completed',
    `value` INTEGER NOT NULL,
    `notes` TEXT NULL,
    `completionTime` TIMESTAMP NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habit_streaks` (
    `id` VARCHAR(191) NOT NULL,
    `habitId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `currentStreak` INTEGER NOT NULL,
    `longestStreak` INTEGER NOT NULL,
    `lastCompletionDate` DATE NULL,
    `streakStartDate` DATE NULL,
    `totalCompletions` INTEGER NOT NULL,
    `totalSessions` INTEGER NOT NULL,
    `completionRate` FLOAT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habit_milestones` (
    `id` VARCHAR(191) NOT NULL,
    `habitId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `targetValue` FLOAT NOT NULL,
    `targetMetric` VARCHAR(50) NOT NULL DEFAULT 'sessions',
    `rewardName` VARCHAR(255) NULL,
    `rewardDescription` TEXT NULL,
    `rewardIcon` VARCHAR(50) NOT NULL DEFAULT '🎉',
    `status` ENUM('locked', 'inProgress', 'achieved') NOT NULL DEFAULT 'locked',
    `currentProgress` DOUBLE NOT NULL DEFAULT 0,
    `achievedDate` DATE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `habitId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `type` ENUM('reminder', 'streakBreak', 'milestoneAchieved', 'encouragement', 'system') NOT NULL DEFAULT 'reminder',
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `sentAt` TIMESTAMP NOT NULL,
    `readAt` TIMESTAMP NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `achievements` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(50) NOT NULL DEFAULT '🏆',
    `category` ENUM('streak', 'completion', 'consistency', 'milestone', 'special') NOT NULL DEFAULT 'streak',
    `criteria` JSON NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `habit_custom_fields` ADD CONSTRAINT `habit_custom_fields_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `habits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `habit_rewards` ADD CONSTRAINT `habit_rewards_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `habits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `habit_logs` ADD CONSTRAINT `habit_logs_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `habits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `habit_streaks` ADD CONSTRAINT `habit_streaks_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `habits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `habit_milestones` ADD CONSTRAINT `habit_milestones_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `habits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `habits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
