-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "published" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "imageUrl" TEXT,
    "selfLink" TEXT
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    CONSTRAINT "Post_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    CONSTRAINT "Page_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
