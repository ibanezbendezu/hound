/*
  Warnings:

  - Added the required column `clusterId` to the `Comparison` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Cluster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clusterDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comparison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sha" TEXT NOT NULL,
    "similarity" REAL NOT NULL,
    "comparisonDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clusterId" INTEGER NOT NULL,
    "repositoryAId" INTEGER NOT NULL,
    "repositoryBId" INTEGER NOT NULL,
    CONSTRAINT "Comparison_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comparison_repositoryAId_fkey" FOREIGN KEY ("repositoryAId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comparison_repositoryBId_fkey" FOREIGN KEY ("repositoryBId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comparison" ("comparisonDate", "id", "repositoryAId", "repositoryBId", "sha", "similarity") SELECT "comparisonDate", "id", "repositoryAId", "repositoryBId", "sha", "similarity" FROM "Comparison";
DROP TABLE "Comparison";
ALTER TABLE "new_Comparison" RENAME TO "Comparison";
CREATE UNIQUE INDEX "Comparison_sha_key" ON "Comparison"("sha");
PRAGMA foreign_key_check("Comparison");
PRAGMA foreign_keys=ON;
