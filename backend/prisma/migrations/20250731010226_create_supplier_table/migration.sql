-- CreateTable
CREATE TABLE "AccountsPayable" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "originalDueDate" TIMESTAMP(3) NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "competenceDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "recurringPurchase" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountsPayable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountsPayable_uuid_key" ON "AccountsPayable"("uuid");

-- AddForeignKey
ALTER TABLE "AccountsPayable" ADD CONSTRAINT "AccountsPayable_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
