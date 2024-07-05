/*
  Warnings:

  - You are about to drop the column `repositoryAId` on the `Comparison` table. All the data in the column will be lost.
  - You are about to drop the column `repositoryBId` on the `Comparison` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ComparisonToRepository" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ComparisonToRepository_A_fkey" FOREIGN KEY ("A") REFERENCES "Comparison" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ComparisonToRepository_B_fkey" FOREIGN KEY ("B") REFERENCES "Repository" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comparison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sha" TEXT NOT NULL,
    "similarity" REAL NOT NULL,
    "comparisonDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clusterId" INTEGER NOT NULL,
    CONSTRAINT "Comparison_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comparison" ("clusterId", "comparisonDate", "id", "sha", "similarity") SELECT "clusterId", "comparisonDate", "id", "sha", "similarity" FROM "Comparison";
DROP TABLE "Comparison";
ALTER TABLE "new_Comparison" RENAME TO "Comparison";
CREATE UNIQUE INDEX "Comparison_sha_key" ON "Comparison"("sha");
PRAGMA foreign_key_check("Comparison");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ComparisonToRepository_AB_unique" ON "_ComparisonToRepository"("A", "B");

-- CreateIndex
CREATE INDEX "_ComparisonToRepository_B_index" ON "_ComparisonToRepository"("B");
