/*
  Warnings:

  - You are about to drop the `_PairToRepository` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PairToRepository";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filepath" TEXT NOT NULL,
    "charCount" INTEGER NOT NULL,
    "lineCount" INTEGER NOT NULL,
    "repositoryId" INTEGER NOT NULL,
    CONSTRAINT "File_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FileToPair" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FileToPair_A_fkey" FOREIGN KEY ("A") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FileToPair_B_fkey" FOREIGN KEY ("B") REFERENCES "Pair" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_FileToPair_AB_unique" ON "_FileToPair"("A", "B");

-- CreateIndex
CREATE INDEX "_FileToPair_B_index" ON "_FileToPair"("B");
