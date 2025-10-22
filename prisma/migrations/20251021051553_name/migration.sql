/*
  Warnings:

  - You are about to alter the column `defaultReminderTime` on the `UserProfile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `lastSyncTime` on the `UserProfile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Made the column `avatarUrl` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `age` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `personalGoals` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `UserProfile` ADD COLUMN `email` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `name` VARCHAR(255) NOT NULL DEFAULT '',
    MODIFY `avatarUrl` VARCHAR(500) NOT NULL DEFAULT '',
    MODIFY `age` INTEGER NOT NULL,
    MODIFY `height` DECIMAL(5, 2) NOT NULL,
    MODIFY `personalGoals` TEXT NOT NULL DEFAULT '',
    MODIFY `defaultReminderTime` TIMESTAMP NULL,
    MODIFY `lastSyncTime` TIMESTAMP NULL;
