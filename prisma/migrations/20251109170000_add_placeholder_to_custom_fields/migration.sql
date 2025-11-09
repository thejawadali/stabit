-- AlterTable: Add placeholder column to habit_custom_fields
ALTER TABLE `habit_custom_fields` 
    ADD COLUMN `placeholder` VARCHAR(255) NULL;

