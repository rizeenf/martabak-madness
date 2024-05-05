/*
  Warnings:

  - You are about to drop the `ProductOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductOrder" DROP CONSTRAINT "ProductOrder_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "products" JSONB[];

-- DropTable
DROP TABLE "ProductOrder";
