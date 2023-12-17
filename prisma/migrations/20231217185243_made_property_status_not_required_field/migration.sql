/*
  Warnings:

  - The `status` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `propertyType` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('SANATORIUM', 'HOTEL');

-- CreateEnum
CREATE TYPE "SanatoriumStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED');

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "postalCode" SET DATA TYPE VARCHAR,
DROP COLUMN "propertyType",
ADD COLUMN     "propertyType" "PropertyType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "SanatoriumStatus" DEFAULT 'PENDING';
