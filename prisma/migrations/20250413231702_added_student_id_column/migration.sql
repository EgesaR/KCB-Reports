/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Class` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Student` ADD COLUMN `classId` VARCHAR(191) NOT NULL,
    ADD COLUMN `streamId` VARCHAR(191) NULL,
    ADD COLUMN `studentId` VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Student_studentId_key` ON `Student`(`studentId`);

-- CreateIndex
CREATE INDEX `Student_studentId_idx` ON `Student`(`studentId`);
