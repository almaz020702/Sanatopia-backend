/*
  Warnings:

  - Added the required column `slug` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "slug" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "slug" VARCHAR NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "Treatment" ALTER COLUMN "name" SET DATA TYPE VARCHAR;
