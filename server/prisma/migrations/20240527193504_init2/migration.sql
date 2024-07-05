/*
  Warnings:

  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `commitHashA` on the `Comparison` table. All the data in the column will be lost.
  - You are about to drop the column `commitHashB` on the `Comparison` table. All the data in the column will be lost.
  - You are about to drop the column `mossReportUrl` on the `Comparison` table. All the data in the column will be lost.
  - You are about to drop the column `similarityScore` on the `Comparison` table. All the data in the column will be lost.
  - Added the required column `similarity` to the `Comparison` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalLines` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Match";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dolosId" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "Fragment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "leftstartRow" INTEGER NOT NULL,
    "leftendRow" INTEGER NOT NULL,
    "leftstartCol" INTEGER NOT NULL,
    "leftendCol" INTEGER NOT NULL,
    "rightstartRow" INTEGER NOT NULL,
    "rightendRow" INTEGER NOT NULL,
    "rightstartCol" INTEGER NOT NULL,
    "rightendCol" INTEGER NOT NULL,
    "parId" INTEGER NOT NULL,
    CONSTRAINT "Fragment_parId_fkey" FOREIGN KEY ("parId") REFERENCES "Pair" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comparison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "similarity" REAL NOT NULL,
    "comparisonDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repositoryAId" INTEGER NOT NULL,
    "repositoryBId" INTEGER NOT NULL,
    CONSTRAINT "Comparison_repositoryAId_fkey" FOREIGN KEY ("repositoryAId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comparison_repositoryBId_fkey" FOREIGN KEY ("repositoryBId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comparison" ("comparisonDate", "id", "repositoryAId", "repositoryBId") SELECT "comparisonDate", "id", "repositoryAId", "repositoryBId" FROM "Comparison";
DROP TABLE "Comparison";
ALTER TABLE "new_Comparison" RENAME TO "Comparison";
CREATE TABLE "new_Repository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalLines" INTEGER NOT NULL
);
INSERT INTO "new_Repository" ("githubId", "id", "name", "owner") SELECT "githubId", "id", "name", "owner" FROM "Repository";
DROP TABLE "Repository";
ALTER TABLE "new_Repository" RENAME TO "Repository";
CREATE UNIQUE INDEX "Repository_githubId_key" ON "Repository"("githubId");
PRAGMA foreign_key_check("Comparison");
PRAGMA foreign_key_check("Repository");
PRAGMA foreign_keys=ON;
