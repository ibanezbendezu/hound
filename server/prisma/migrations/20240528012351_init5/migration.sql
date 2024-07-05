-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Repository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalLines" INTEGER NOT NULL
);
INSERT INTO "new_Repository" ("githubId", "id", "name", "owner", "totalLines") SELECT "githubId", "id", "name", "owner", "totalLines" FROM "Repository";
DROP TABLE "Repository";
ALTER TABLE "new_Repository" RENAME TO "Repository";
CREATE UNIQUE INDEX "Repository_githubId_key" ON "Repository"("githubId");
CREATE TABLE "new_Comparison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sha" TEXT NOT NULL,
    "similarity" REAL NOT NULL,
    "comparisonDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repositoryAId" INTEGER NOT NULL,
    "repositoryBId" INTEGER NOT NULL,
    CONSTRAINT "Comparison_repositoryAId_fkey" FOREIGN KEY ("repositoryAId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comparison_repositoryBId_fkey" FOREIGN KEY ("repositoryBId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comparison" ("comparisonDate", "id", "repositoryAId", "repositoryBId", "sha", "similarity") SELECT "comparisonDate", "id", "repositoryAId", "repositoryBId", "sha", "similarity" FROM "Comparison";
DROP TABLE "Comparison";
ALTER TABLE "new_Comparison" RENAME TO "Comparison";
PRAGMA foreign_key_check("Repository");
PRAGMA foreign_key_check("Comparison");
PRAGMA foreign_keys=ON;
