/*
  Warnings:

  - The primary key for the `PaymentStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PaymentStatus` table. All the data in the column will be lost.
  - The primary key for the `PaymentType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PaymentType` table. All the data in the column will be lost.
  - Added the required column `label` to the `PaymentStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `PaymentType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_typeId_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "statusId" SET DATA TYPE TEXT,
ALTER COLUMN "typeId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PaymentStatus" DROP CONSTRAINT "PaymentStatus_pkey",
DROP COLUMN "id",
ADD COLUMN     "label" TEXT NOT NULL,
ADD CONSTRAINT "PaymentStatus_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "PaymentType" DROP CONSTRAINT "PaymentType_pkey",
DROP COLUMN "id",
ADD COLUMN     "label" TEXT NOT NULL,
ADD CONSTRAINT "PaymentType_pkey" PRIMARY KEY ("name");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PaymentType"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "PaymentStatus"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
