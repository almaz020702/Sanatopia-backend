/*
  Warnings:

  - The `status` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED');

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "status",
ADD COLUMN     "status" "PropertyStatus" DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "SanatoriumStatus";
