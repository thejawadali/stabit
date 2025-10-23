/*
  Warnings:

  - You are about to drop the column `soundNotifications` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to alter the column `lastSyncTime` on the `UserProfile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `UserProfile` DROP COLUMN `soundNotifications`,
    ADD COLUMN `emailNotifications` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `enableMilestones` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `enableReminders` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `enableStreaks` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `inAppNotifications` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isSnoozed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pushNotifications` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `quietHoursDays` JSON NULL,
    ADD COLUMN `quietHoursEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quietHoursEnd` VARCHAR(10) NULL,
    ADD COLUMN `quietHoursStart` VARCHAR(10) NULL,
    ADD COLUMN `reminderTone` ENUM('gentle', 'motivational', 'energetic', 'calm', 'custom') NOT NULL DEFAULT 'gentle',
    ADD COLUMN `smartReminders` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `snoozeDuration` ENUM('fifteenMinutes', 'oneHour', 'twoHours', 'fourHours', 'eightHours', 'twentyFourHours') NOT NULL DEFAULT 'oneHour',
    ADD COLUMN `snoozeUntil` TIMESTAMP NULL,
    MODIFY `personalGoals` TEXT NOT NULL DEFAULT '',
    MODIFY `defaultReminderTime` VARCHAR(20) NULL DEFAULT '23:00 PM',
    MODIFY `lastSyncTime` TIMESTAMP NULL;
