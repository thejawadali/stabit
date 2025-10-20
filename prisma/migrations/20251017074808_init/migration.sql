-- CreateTable
CREATE TABLE `UserProfile` (
    `userId` VARCHAR(191) NOT NULL,
    `avatarUrl` VARCHAR(500) NULL DEFAULT '',
    `timezone` VARCHAR(50) NOT NULL DEFAULT 'UTC',
    `language` VARCHAR(10) NOT NULL DEFAULT 'en',
    `dateFormat` VARCHAR(20) NOT NULL DEFAULT 'MM/DD/YYYY',
    `theme` ENUM('light', 'dark', 'system') NOT NULL DEFAULT 'system',
    `age` INTEGER NULL,
    `gender` ENUM('male', 'female', 'other') NOT NULL DEFAULT 'male',
    `height` DECIMAL(5, 2) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `personalGoals` TEXT NULL DEFAULT '',
    `preferredTimeUnits` ENUM('minutes', 'hours') NOT NULL DEFAULT 'minutes',
    `preferredCountUnits` ENUM('repetitions', 'sessions', 'times', 'items') NOT NULL DEFAULT 'repetitions',
    `defaultReminderTime` TIMESTAMP NULL,
    `defaultTrackingType` ENUM('duration', 'count', 'both') NOT NULL DEFAULT 'duration',
    `defaultGoalFrequency` ENUM('daily', 'weekly', 'monthly') NOT NULL DEFAULT 'daily',
    `autoSync` BOOLEAN NOT NULL DEFAULT true,
    `lastSyncTime` TIMESTAMP NULL,
    `defaultDashboardView` ENUM('overview', 'analytics', 'calendar', 'progress') NOT NULL DEFAULT 'overview',
    `showWelcomeMessage` BOOLEAN NOT NULL DEFAULT true,
    `notificationsEnabled` BOOLEAN NOT NULL DEFAULT false,
    `soundNotifications` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
