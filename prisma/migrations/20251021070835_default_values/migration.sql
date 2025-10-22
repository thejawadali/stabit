/*
  Warnings:

  - You are about to alter the column `defaultReminderTime` on the `UserProfile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `lastSyncTime` on the `UserProfile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `UserProfile` MODIFY `age` INTEGER NOT NULL DEFAULT 0,
    MODIFY `height` DECIMAL(5, 2) NOT NULL DEFAULT 0.0,
    MODIFY `personalGoals` TEXT NOT NULL DEFAULT '',
    MODIFY `defaultReminderTime` TIMESTAMP NULL,
    MODIFY `lastSyncTime` TIMESTAMP NULL;
