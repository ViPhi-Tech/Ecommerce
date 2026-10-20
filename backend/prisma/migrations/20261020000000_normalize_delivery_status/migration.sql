-- Normalize delivery status values to uppercase
ALTER TABLE "Delivery" ALTER COLUMN "status" SET DEFAULT 'PENDING';
UPDATE "Delivery" SET "status" = UPPER("status") WHERE "status" <> UPPER("status");
