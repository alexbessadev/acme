/*
  Warnings:

  - The values [PENDING,PAID] on the enum `InvoiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `mouth` on the `revenues` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[month]` on the table `revenues` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `month` to the `revenues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvoiceStatus_new" AS ENUM ('PEDENTE', 'PAGO');
ALTER TABLE "invoices" ALTER COLUMN "status" TYPE "InvoiceStatus_new" USING ("status"::text::"InvoiceStatus_new");
ALTER TYPE "InvoiceStatus" RENAME TO "InvoiceStatus_old";
ALTER TYPE "InvoiceStatus_new" RENAME TO "InvoiceStatus";
DROP TYPE "InvoiceStatus_old";
COMMIT;

-- DropIndex
DROP INDEX "revenues_mouth_key";

-- AlterTable
ALTER TABLE "revenues" DROP COLUMN "mouth",
ADD COLUMN     "month" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "revenues_month_key" ON "revenues"("month");
