/*
  Warnings:

  - You are about to alter the column `height` on the `UserProfile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Int`.
  - You are about to alter the column `defaultReminderTime` on the `UserProfile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `lastSyncTime` on the `UserProfile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `UserProfile` MODIFY `height` INTEGER NOT NULL DEFAULT 0,
    MODIFY `personalGoals` TEXT NOT NULL DEFAULT '',
    MODIFY `defaultReminderTime` TIMESTAMP NULL,
    MODIFY `lastSyncTime` TIMESTAMP NULL;
