-- AlterTable: Add customFields and durationMinutes columns to habit_logs
ALTER TABLE `habit_logs` 
    ADD COLUMN `durationMinutes` INT NULL,
    ADD COLUMN `customFields` JSON NULL;

