-- AlterTable
ALTER TABLE "PurchaseInvoiceItem" ADD COLUMN     "totalCost" DECIMAL(14,2),
ADD COLUMN     "totalWithTax" DECIMAL(14,2),
ADD COLUMN     "unitCost" DECIMAL(14,4),
ADD COLUMN     "unitTotalWithTax" DECIMAL(14,4);
