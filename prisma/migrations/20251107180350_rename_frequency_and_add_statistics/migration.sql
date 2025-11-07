/*
  Warnings:

  - You are about to drop the `habit_streaks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `isActive` on the `habits` table. All the data in the column will be lost.
  - You are about to alter the column `recurrenceType` on the `habits` table. The data in that column could be lost. The data in that column will be cast from `Enum('daily', 'weekly', 'monthly')` to `Enum('daily', 'weekly', 'monthly')`.

*/
-- DropTable (foreign key will be automatically dropped)
DROP TABLE IF EXISTS `habit_streaks`;

-- AlterTable: Add new columns first
ALTER TABLE `habits` 
    ADD COLUMN `frequency` ENUM('daily', 'weekly', 'monthly') NOT NULL DEFAULT 'daily',
    ADD COLUMN `totalCompletions` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalMissed` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalSkipped` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `currentStreak` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `longestStreak` INTEGER NOT NULL DEFAULT 0;

-- Copy data from recurrenceType to frequency
UPDATE `habits` SET `frequency` = `recurrenceType` WHERE `recurrenceType` IS NOT NULL;

-- Drop old columns
ALTER TABLE `habits` 
    DROP COLUMN `isActive`,
    DROP COLUMN `recurrenceType`;

-- CreateIndex
CREATE UNIQUE INDEX `habits_name_userId_key` ON `habits`(`name`, `userId`);

