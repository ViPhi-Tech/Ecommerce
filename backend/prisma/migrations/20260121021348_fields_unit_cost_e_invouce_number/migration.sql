/*
  Warnings:

  - You are about to drop the column `dueDate` on the `PurchaseInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `external_id` on the `PurchaseInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PurchaseInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `taxAmount` on the `PurchaseInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PurchaseInvoice` table. All the data in the column will be lost.
  - You are about to alter the column `totalAmount` on the `PurchaseInvoice` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to drop the column `price` on the `PurchaseInvoiceItem` table. All the data in the column will be lost.
  - You are about to alter the column `totalAmount` on the `PurchaseInvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - A unique constraint covering the columns `[accessKey]` on the table `PurchaseInvoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessKey` to the `PurchaseInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `PurchaseInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protocol` to the `PurchaseInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTax` to the `PurchaseInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xmlRaw` to the `PurchaseInvoice` table without a default value. This is not possible if the table is not empty.
  - Made the column `number` on table `PurchaseInvoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `series` on table `PurchaseInvoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `supplierId` on table `PurchaseInvoice` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `cfop` to the `PurchaseInvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `PurchaseInvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ncm` to the `PurchaseInvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxData` to the `PurchaseInvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `PurchaseInvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PurchaseInvoice" DROP CONSTRAINT "PurchaseInvoice_supplierId_fkey";

-- DropIndex
DROP INDEX "PurchaseInvoice_external_id_key";

-- AlterTable
ALTER TABLE "PurchaseInvoice" DROP COLUMN "dueDate",
DROP COLUMN "external_id",
DROP COLUMN "status",
DROP COLUMN "taxAmount",
DROP COLUMN "updatedAt",
ADD COLUMN     "accessKey" TEXT NOT NULL,
ADD COLUMN     "model" INTEGER NOT NULL,
ADD COLUMN     "protocol" JSONB NOT NULL,
ADD COLUMN     "totalTax" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "xmlRaw" JSONB NOT NULL,
ALTER COLUMN "number" SET NOT NULL,
ALTER COLUMN "series" SET NOT NULL,
ALTER COLUMN "entryDate" DROP DEFAULT,
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(14,2),
ALTER COLUMN "supplierId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseInvoiceItem" DROP COLUMN "price",
ADD COLUMN     "cfop" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "ncm" TEXT NOT NULL,
ADD COLUMN     "taxData" JSONB NOT NULL,
ADD COLUMN     "unitPrice" DECIMAL(14,4) NOT NULL,
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(14,4),
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(14,2);

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "unitCost" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseInvoice_accessKey_key" ON "PurchaseInvoice"("accessKey");

-- AddForeignKey
ALTER TABLE "PurchaseInvoice" ADD CONSTRAINT "PurchaseInvoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
