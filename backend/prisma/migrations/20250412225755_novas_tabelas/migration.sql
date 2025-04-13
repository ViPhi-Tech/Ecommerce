/*
  Warnings:

  - You are about to drop the column `full_name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `google_id` on the `Login` table. All the data in the column will be lost.
  - You are about to drop the column `hashed_password` on the `Login` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `login_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `Login` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[loginId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('RESELLER', 'DISTRIBUTOR', 'AFFILIATE', 'AGENT', 'OTHER');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_company_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_login_id_fkey";

-- DropIndex
DROP INDEX "Login_google_id_key";

-- DropIndex
DROP INDEX "User_login_id_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "full_name",
DROP COLUMN "is_active",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Login" DROP COLUMN "google_id",
DROP COLUMN "hashed_password",
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "hashedPassword" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "company_id",
DROP COLUMN "full_name",
DROP COLUMN "is_active",
DROP COLUMN "login_id",
ADD COLUMN     "companyId" INTEGER,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "loginId" INTEGER;

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT,
    "document" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "loginId" INTEGER,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sku" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" INTEGER,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "companyName" TEXT,
    "document" TEXT,
    "type" "PartnerType" NOT NULL DEFAULT 'RESELLER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_document_key" ON "Client"("document");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_loginId_key" ON "Client"("loginId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_email_key" ON "Partner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Login_googleId_key" ON "Login"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_loginId_key" ON "User"("loginId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_loginId_fkey" FOREIGN KEY ("loginId") REFERENCES "Login"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_loginId_fkey" FOREIGN KEY ("loginId") REFERENCES "Login"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
