/*
  Warnings:

  - You are about to alter the column `point` on the `Setting` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,1)` to `Decimal(2,1)`.

*/
-- AlterTable
ALTER TABLE "Setting" ALTER COLUMN "point" SET DATA TYPE DECIMAL(2,1);
