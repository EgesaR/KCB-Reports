/*
  Warnings:

  - You are about to alter the column `roleName` on the `AdminRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Blog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Class` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Department` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `subject` on the `Mark` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `examinationName` on the `Mark` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `author` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `status` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `name` on the `School` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Subject` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `departmentGroup` on the `TeacherProfile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `updatedAt` to the `AdminRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Mark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ReportTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TeacherProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Blog_id_idx` ON `Blog`;

-- AlterTable
ALTER TABLE `AdminRole` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `roleName` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `Blog` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Category` MODIFY `name` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `Class` MODIFY `name` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `Department` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `Mark` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `subject` VARCHAR(50) NOT NULL,
    MODIFY `examinationName` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `Page` MODIFY `title` VARCHAR(200) NOT NULL,
    MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `slug` VARCHAR(255) NOT NULL,
    MODIFY `title` VARCHAR(200) NOT NULL,
    MODIFY `imageUrl` VARCHAR(512) NULL,
    MODIFY `author` VARCHAR(100) NOT NULL,
    MODIFY `introduction` TEXT NULL,
    MODIFY `content` TEXT NOT NULL,
    MODIFY `conclusion` TEXT NULL,
    MODIFY `authorBio` VARCHAR(200) NULL,
    MODIFY `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE `ReportTask` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `title` VARCHAR(200) NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `School` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `badgeUrl` VARCHAR(512) NULL;

-- AlterTable
ALTER TABLE `SchoolAssociation` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Student` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `Subject` MODIFY `name` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `TeacherProfile` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `subjects` TEXT NOT NULL,
    MODIFY `classes` TEXT NOT NULL,
    MODIFY `streams` TEXT NOT NULL,
    MODIFY `departmentGroup` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL,
    MODIFY `profileUrl` VARCHAR(512) NULL,
    MODIFY `profilePicture` VARCHAR(512) NULL;

-- AlterTable
ALTER TABLE `UserAdminRole` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `UserStudent` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `department_teacher_profile` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `read` BOOLEAN NOT NULL DEFAULT false,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `type` VARCHAR(20) NOT NULL,
    `avatar` VARCHAR(512) NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_date_idx`(`date`),
    INDEX `Notification_read_idx`(`read`),
    INDEX `Notification_archived_idx`(`archived`),
    INDEX `Notification_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `AdminRole_roleName_idx` ON `AdminRole`(`roleName`);

-- CreateIndex
CREATE INDEX `Blog_publishedAt_idx` ON `Blog`(`publishedAt`);

-- CreateIndex
CREATE INDEX `Blog_updatedAt_idx` ON `Blog`(`updatedAt`);

-- CreateIndex
CREATE INDEX `Category_name_idx` ON `Category`(`name`);

-- CreateIndex
CREATE INDEX `Class_name_idx` ON `Class`(`name`);

-- CreateIndex
CREATE INDEX `Department_name_idx` ON `Department`(`name`);

-- CreateIndex
CREATE INDEX `Mark_studentId_idx` ON `Mark`(`studentId`);

-- CreateIndex
CREATE INDEX `Mark_subject_idx` ON `Mark`(`subject`);

-- CreateIndex
CREATE INDEX `Mark_createdAt_idx` ON `Mark`(`createdAt`);

-- CreateIndex
CREATE INDEX `Page_title_idx` ON `Page`(`title`);

-- CreateIndex
CREATE INDEX `Post_slug_idx` ON `Post`(`slug`);

-- CreateIndex
CREATE INDEX `Post_publishedAt_idx` ON `Post`(`publishedAt`);

-- CreateIndex
CREATE INDEX `Post_status_idx` ON `Post`(`status`);

-- CreateIndex
CREATE INDEX `Post_author_idx` ON `Post`(`author`);

-- CreateIndex
CREATE INDEX `PostCategories_categoryId_idx` ON `PostCategories`(`categoryId`);

-- CreateIndex
CREATE INDEX `RelatedPosts_relatedPostId_idx` ON `RelatedPosts`(`relatedPostId`);

-- CreateIndex
CREATE INDEX `ReportTask_createdById_idx` ON `ReportTask`(`createdById`);

-- CreateIndex
CREATE INDEX `ReportTask_teacherId_idx` ON `ReportTask`(`teacherId`);

-- CreateIndex
CREATE INDEX `ReportTask_createdAt_idx` ON `ReportTask`(`createdAt`);

-- CreateIndex
CREATE INDEX `School_name_idx` ON `School`(`name`);

-- CreateIndex
CREATE INDEX `SchoolAssociation_schoolId_idx` ON `SchoolAssociation`(`schoolId`);

-- CreateIndex
CREATE INDEX `Student_name_idx` ON `Student`(`name`);

-- CreateIndex
CREATE INDEX `Subject_name_idx` ON `Subject`(`name`);

-- CreateIndex
CREATE INDEX `TeacherProfile_userId_idx` ON `TeacherProfile`(`userId`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- CreateIndex
CREATE INDEX `User_createdAt_idx` ON `User`(`createdAt`);

-- CreateIndex
CREATE INDEX `UserAdminRole_adminRoleId_idx` ON `UserAdminRole`(`adminRoleId`);

-- CreateIndex
CREATE INDEX `UserRole_role_idx` ON `UserRole`(`role`);

-- CreateIndex
CREATE INDEX `UserStudent_studentId_idx` ON `UserStudent`(`studentId`);

-- CreateIndex
CREATE INDEX `department_teacher_profile_departmentId_idx` ON `department_teacher_profile`(`departmentId`);

-- CreateIndex
CREATE INDEX `department_teacher_profile_profileId_idx` ON `department_teacher_profile`(`profileId`);
