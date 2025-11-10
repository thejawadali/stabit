-- AlterTable: Remove logDate, completionTime, and updatedAt columns from habit_logs
ALTER TABLE `habit_logs` 
    DROP COLUMN `logDate`,
    DROP COLUMN `completionTime`,
    DROP COLUMN `updatedAt`;

