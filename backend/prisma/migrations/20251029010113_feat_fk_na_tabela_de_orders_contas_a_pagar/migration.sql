-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "accountsReceivableId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_accountsReceivableId_fkey" FOREIGN KEY ("accountsReceivableId") REFERENCES "AccountsReceivable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
