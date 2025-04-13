-- AlterTable
ALTER TABLE "User" ADD COLUMN     "company_id" INTEGER;

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
