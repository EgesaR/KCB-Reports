/*
  Warnings:

  - You are about to drop the column `updated` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `publishedAt` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Made the column `selfLink` on table `Blog` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Blog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "published" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,
    "selfLink" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Blog" ("description", "id", "imageUrl", "name", "published", "selfLink") SELECT "description", "id", "imageUrl", "name", "published", "selfLink" FROM "Blog";
DROP TABLE "Blog";
ALTER TABLE "new_Blog" RENAME TO "Blog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
