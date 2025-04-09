/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Gift` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Gift_name_key" ON "Gift"("name");
