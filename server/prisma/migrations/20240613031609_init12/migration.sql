/*
  Warnings:

  - You are about to drop the column `tokens` on the `User` table. All the data in the column will be lost.
  - Added the required column `githubToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "githubToken" TEXT NOT NULL
);
INSERT INTO "new_User" ("githubId", "id", "name") SELECT "githubId", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_key_check("User");
PRAGMA foreign_keys=ON;
