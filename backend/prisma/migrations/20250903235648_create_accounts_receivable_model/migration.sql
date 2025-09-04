-- CreateTable
CREATE TABLE "public"."AccountsReceivable" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "originalDueDate" TIMESTAMP(3),
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "competenceDate" TIMESTAMP(3),
    "recurringIncome" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountsReceivable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountsReceivable_uuid_key" ON "public"."AccountsReceivable"("uuid");

-- AddForeignKey
ALTER TABLE "public"."AccountsReceivable" ADD CONSTRAINT "AccountsReceivable_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
