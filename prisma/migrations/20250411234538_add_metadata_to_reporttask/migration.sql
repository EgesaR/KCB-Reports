-- AlterTable
ALTER TABLE `Mark` ADD COLUMN `reportTaskId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ReportTask` ADD COLUMN `metadata` JSON NULL;

-- CreateIndex
CREATE INDEX `Mark_teacherId_idx` ON `Mark`(`teacherId`);

-- CreateIndex
CREATE INDEX `Mark_adminId_idx` ON `Mark`(`adminId`);

-- CreateIndex
CREATE INDEX `Mark_parentId_idx` ON `Mark`(`parentId`);

-- CreateIndex
CREATE INDEX `Mark_reportTaskId_idx` ON `Mark`(`reportTaskId`);
