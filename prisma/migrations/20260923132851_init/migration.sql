/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Microservices` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Microservices_secret_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Microservices_name_key" ON "Microservices"("name");
