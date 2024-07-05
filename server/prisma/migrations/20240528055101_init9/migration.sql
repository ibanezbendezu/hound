/*
  Warnings:

  - You are about to drop the column `githubId` on the `Repository` table. All the data in the column will be lost.
  - Added the required column `sha` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sha` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sha" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "charCount" INTEGER NOT NULL,
    "lineCount" INTEGER NOT NULL,
    "repositoryId" INTEGER NOT NULL,
    CONSTRAINT "File_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("charCount", "filepath", "id", "lineCount", "repositoryId") SELECT "charCount", "filepath", "id", "lineCount", "repositoryId" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_sha_key" ON "File"("sha");
CREATE TABLE "new_Repository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sha" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalLines" INTEGER NOT NULL
);
INSERT INTO "new_Repository" ("id", "name", "owner", "totalLines") SELECT "id", "name", "owner", "totalLines" FROM "Repository";
DROP TABLE "Repository";
ALTER TABLE "new_Repository" RENAME TO "Repository";
CREATE UNIQUE INDEX "Repository_sha_key" ON "Repository"("sha");
PRAGMA foreign_key_check("File");
PRAGMA foreign_key_check("Repository");
PRAGMA foreign_keys=ON;
