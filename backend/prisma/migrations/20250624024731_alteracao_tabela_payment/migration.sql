/*
  Warnings:

  - You are about to drop the `_PaymentToPaymentStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PaymentToPaymentType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `statusId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PaymentToPaymentStatus" DROP CONSTRAINT "_PaymentToPaymentStatus_A_fkey";

-- DropForeignKey
ALTER TABLE "_PaymentToPaymentStatus" DROP CONSTRAINT "_PaymentToPaymentStatus_B_fkey";

-- DropForeignKey
ALTER TABLE "_PaymentToPaymentType" DROP CONSTRAINT "_PaymentToPaymentType_A_fkey";

-- DropForeignKey
ALTER TABLE "_PaymentToPaymentType" DROP CONSTRAINT "_PaymentToPaymentType_B_fkey";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "statusId" INTEGER NOT NULL,
ADD COLUMN     "typeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PaymentToPaymentStatus";

-- DropTable
DROP TABLE "_PaymentToPaymentType";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PaymentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "PaymentStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
