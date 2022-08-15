/*
  Warnings:

  - You are about to alter the column `point` on the `Setting` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,1)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Setting" ALTER COLUMN "point" SET DEFAULT 0,
ALTER COLUMN "point" SET DATA TYPE INTEGER;
