/*
  Warnings:

  - You are about to drop the column `repositoryId` on the `Pair` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_PairToRepository" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PairToRepository_A_fkey" FOREIGN KEY ("A") REFERENCES "Pair" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PairToRepository_B_fkey" FOREIGN KEY ("B") REFERENCES "Repository" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "lineCountRight" INTEGER NOT NULL
);
INSERT INTO "new_Pair" ("charCountLeft", "charCountRight", "id", "leftFilepath", "lineCountLeft", "lineCountRight", "rightFilepath", "similarity") SELECT "charCountLeft", "charCountRight", "id", "leftFilepath", "lineCountLeft", "lineCountRight", "rightFilepath", "similarity" FROM "Pair";
DROP TABLE "Pair";
ALTER TABLE "new_Pair" RENAME TO "Pair";
PRAGMA foreign_key_check("Pair");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_PairToRepository_AB_unique" ON "_PairToRepository"("A", "B");

-- CreateIndex
CREATE INDEX "_PairToRepository_B_index" ON "_PairToRepository"("B");
