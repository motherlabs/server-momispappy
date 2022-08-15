/*
  Warnings:

  - You are about to alter the column `point` on the `Setting` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(3,1)`.

*/
-- AlterTable
ALTER TABLE "Setting" ALTER COLUMN "point" SET DEFAULT 0.0,
ALTER COLUMN "point" SET DATA TYPE DECIMAL(3,1);
