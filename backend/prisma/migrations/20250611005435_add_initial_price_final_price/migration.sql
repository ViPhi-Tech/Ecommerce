/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "finalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "initialPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "shortDescription" TEXT;
