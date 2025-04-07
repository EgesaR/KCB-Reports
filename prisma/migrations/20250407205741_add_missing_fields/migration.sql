-- AlterTable
ALTER TABLE `User` ADD COLUMN `googleRefreshToken` VARCHAR(512) NULL,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL;
