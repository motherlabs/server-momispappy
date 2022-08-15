/*
  Warnings:

  - The `isEvent` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `isPrice` column on the `Setting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `isPoint` column on the `Setting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isEvent",
ADD COLUMN     "isEvent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "isPrice",
ADD COLUMN     "isPrice" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "isPoint",
ADD COLUMN     "isPoint" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "YN";
