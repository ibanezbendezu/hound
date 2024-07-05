/*
  Warnings:

  - You are about to drop the `_ComparisonToRepository` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `repositoryAId` to the `Comparison` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repositoryBId` to the `Comparison` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_ComparisonToRepository_B_index";

-- DropIndex
DROP INDEX "_ComparisonToRepository_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ComparisonToRepository";
PRAGMA foreign_keys=on;

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
INSERT INTO "new_Comparison" ("clusterId", "comparisonDate", "id", "sha", "similarity") SELECT "clusterId", "comparisonDate", "id", "sha", "similarity" FROM "Comparison";
DROP TABLE "Comparison";
ALTER TABLE "new_Comparison" RENAME TO "Comparison";
CREATE UNIQUE INDEX "Comparison_sha_key" ON "Comparison"("sha");
PRAGMA foreign_key_check("Comparison");
PRAGMA foreign_keys=ON;
