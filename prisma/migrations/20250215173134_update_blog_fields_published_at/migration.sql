/*
  Warnings:

  - You are about to drop the column `published` on the `Blog` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Blog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,
    "selfLink" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Blog" ("description", "id", "imageUrl", "name", "publishedAt", "selfLink", "updatedAt") SELECT "description", "id", "imageUrl", "name", "publishedAt", "selfLink", "updatedAt" FROM "Blog";
DROP TABLE "Blog";
ALTER TABLE "new_Blog" RENAME TO "Blog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
