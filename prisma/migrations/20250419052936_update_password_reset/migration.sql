/*
  Warnings:

  - You are about to alter the column `code` on the `PasswordReset` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(6)`.

*/
-- DropIndex
DROP INDEX `PasswordReset_email_key` ON `PasswordReset`;

-- AlterTable
ALTER TABLE `PasswordReset` MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `code` VARCHAR(6) NOT NULL;

-- CreateIndex
CREATE INDEX `PasswordReset_email_idx` ON `PasswordReset`(`email`);
