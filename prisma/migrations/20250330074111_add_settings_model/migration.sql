-- AlterTable
ALTER TABLE `Subject` ADD COLUMN `description` TEXT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `accentColor` VARCHAR(191) NULL DEFAULT '#3b82f6',
    ADD COLUMN `contact` VARCHAR(100) NULL,
    ADD COLUMN `department` VARCHAR(100) NULL,
    ADD COLUMN `highContrast` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `institutionalLogo` VARCHAR(512) NULL,
    ADD COLUMN `reportFont` VARCHAR(191) NULL DEFAULT 'Arial',
    ADD COLUMN `studentId` VARCHAR(50) NULL,
    ADD COLUMN `themePreference` ENUM('LIGHT', 'DARK', 'SYSTEM') NOT NULL DEFAULT 'SYSTEM',
    ADD COLUMN `title` VARCHAR(100) NULL,
    ADD COLUMN `twoFactorEnabled` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `UserRole` MODIFY `role` ENUM('ADMIN', 'PARENT', 'TEACHER', 'STUDENT') NOT NULL;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `Session_userId_idx`(`userId`),
    INDEX `Session_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSubject` (
    `userId` VARCHAR(191) NOT NULL,
    `subjectId` INTEGER NOT NULL,

    INDEX `UserSubject_subjectId_idx`(`subjectId`),
    PRIMARY KEY (`userId`, `subjectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
