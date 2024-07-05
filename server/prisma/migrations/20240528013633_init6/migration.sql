/*
  Warnings:

  - You are about to drop the column `dolosId` on the `Pair` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "similarity" REAL NOT NULL,
    "leftFilepath" TEXT NOT NULL,
    "charCountLeft" INTEGER NOT NULL,
    "lineCountLeft" INTEGER NOT NULL,
    "rightFilepath" TEXT NOT NULL,
    "charCountRight" INTEGER NOT NULL,
    "lineCountRight" INTEGER NOT NULL,
    "repositoryId" INTEGER NOT NULL,
    CONSTRAINT "Pair_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pair" ("charCountLeft", "charCountRight", "id", "leftFilepath", "lineCountLeft", "lineCountRight", "repositoryId", "rightFilepath", "similarity") SELECT "charCountLeft", "charCountRight", "id", "leftFilepath", "lineCountLeft", "lineCountRight", "repositoryId", "rightFilepath", "similarity" FROM "Pair";
DROP TABLE "Pair";
ALTER TABLE "new_Pair" RENAME TO "Pair";
PRAGMA foreign_key_check("Pair");
PRAGMA foreign_keys=ON;
