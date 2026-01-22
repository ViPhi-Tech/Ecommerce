-- AlterTable
ALTER TABLE "PurchaseInvoiceItem" ADD COLUMN     "code" TEXT,
ADD COLUMN     "cst" TEXT,
ADD COLUMN     "discount" DECIMAL(14,2),
ADD COLUMN     "icmsBase" DECIMAL(14,2),
ADD COLUMN     "icmsRate" DECIMAL(14,4),
ADD COLUMN     "icmsStBase" DECIMAL(14,2),
ADD COLUMN     "icmsStValue" DECIMAL(14,2),
ADD COLUMN     "icmsValue" DECIMAL(14,2),
ADD COLUMN     "ipiRate" DECIMAL(14,4),
ADD COLUMN     "ipiValue" DECIMAL(14,2),
ADD COLUMN     "unit" TEXT;
