/*
  Warnings:

  - Made the column `description` on table `Blog` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Blog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "published" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "imageUrl" TEXT,
    "selfLink" TEXT
);
INSERT INTO "new_Blog" ("description", "id", "imageUrl", "name", "published", "selfLink", "updated") SELECT "description", "id", "imageUrl", "name", "published", "selfLink", "updated" FROM "Blog";
DROP TABLE "Blog";
ALTER TABLE "new_Blog" RENAME TO "Blog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
