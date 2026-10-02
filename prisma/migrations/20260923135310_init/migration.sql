/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Microservices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,secret]` on the table `Microservices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Microservices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Microservices_name_key";

-- AlterTable
ALTER TABLE "Microservices" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Microservices_userId_name_key" ON "Microservices"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Microservices_name_secret_key" ON "Microservices"("name", "secret");

-- AddForeignKey
ALTER TABLE "Microservices" ADD CONSTRAINT "Microservices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
