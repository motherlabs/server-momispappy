/*
  Warnings:

  - You are about to drop the column `settingId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_settingId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "settingId",
DROP COLUMN "status";
