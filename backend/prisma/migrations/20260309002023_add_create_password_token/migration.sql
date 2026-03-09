/*
  Warnings:

  - A unique constraint covering the columns `[createPasswordToken]` on the table `Login` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Login" ADD COLUMN     "createPasswordToken" TEXT,
ADD COLUMN     "createPasswordTokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Login_createPasswordToken_key" ON "Login"("createPasswordToken");
