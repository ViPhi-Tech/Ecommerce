/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `partnerId` column on the `Address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Partner.ts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Partner.ts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_partnerId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "partnerId",
ADD COLUMN     "partnerId" INTEGER,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Partner_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Address_partnerId_key" ON "Address"("partnerId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
