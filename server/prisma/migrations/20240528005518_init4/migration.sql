/*
  Warnings:

  - A unique constraint covering the columns `[sha]` on the table `Comparison` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comparison_sha_key" ON "Comparison"("sha");
