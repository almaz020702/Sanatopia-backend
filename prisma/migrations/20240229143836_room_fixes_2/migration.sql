/*
  Warnings:

  - You are about to drop the column `capacity` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerDay` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `surfaceArea` on the `Room` table. All the data in the column will be lost.
  - Added the required column `capacity` to the `RoomType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerDay` to the `RoomType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surfaceArea` to the `RoomType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "capacity",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "number",
DROP COLUMN "pricePerDay",
DROP COLUMN "surfaceArea";

-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "pricePerDay" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "surfaceArea" DOUBLE PRECISION NOT NULL;
