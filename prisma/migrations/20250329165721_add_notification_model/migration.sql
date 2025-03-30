/*
  Warnings:

  - You are about to drop the column `avatar` on the `Notification` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(191)`.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Notification_archived_idx` ON `Notification`;

-- DropIndex
DROP INDEX `Notification_date_idx` ON `Notification`;

-- DropIndex
DROP INDEX `Notification_read_idx` ON `Notification`;

-- DropIndex
DROP INDEX `Notification_type_idx` ON `Notification`;

-- DropIndex
DROP INDEX `Notification_userId_idx` ON `Notification`;

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `avatar`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `message` VARCHAR(191) NOT NULL,
    ALTER COLUMN `date` DROP DEFAULT,
    MODIFY `type` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL;
