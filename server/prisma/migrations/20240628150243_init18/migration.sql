/*
  Warnings:

  - You are about to drop the column `parId` on the `Fragment` table. All the data in the column will be lost.
  - Added the required column `pairId` to the `Fragment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Fragment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "leftstartRow" INTEGER NOT NULL,
    "leftendRow" INTEGER NOT NULL,
    "leftstartCol" INTEGER NOT NULL,
    "leftendCol" INTEGER NOT NULL,
    "rightstartRow" INTEGER NOT NULL,
    "rightendRow" INTEGER NOT NULL,
    "rightstartCol" INTEGER NOT NULL,
    "rightendCol" INTEGER NOT NULL,
    "pairId" INTEGER NOT NULL,
    CONSTRAINT "Fragment_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Fragment" ("id", "leftendCol", "leftendRow", "leftstartCol", "leftstartRow", "rightendCol", "rightendRow", "rightstartCol", "rightstartRow") SELECT "id", "leftendCol", "leftendRow", "leftstartCol", "leftstartRow", "rightendCol", "rightendRow", "rightstartCol", "rightstartRow" FROM "Fragment";
DROP TABLE "Fragment";
ALTER TABLE "new_Fragment" RENAME TO "Fragment";
PRAGMA foreign_key_check("Fragment");
PRAGMA foreign_keys=ON;
