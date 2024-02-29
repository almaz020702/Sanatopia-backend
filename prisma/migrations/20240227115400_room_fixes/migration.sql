/*
  Warnings:

  - You are about to drop the column `guests` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `Booking` table. All the data in the column will be lost.
  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `quantity` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `roomType` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `RoomFacility` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roomId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomTypeId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELED', 'PENDING');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "RoomFacility" DROP CONSTRAINT "RoomFacility_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "RoomFacility" DROP CONSTRAINT "RoomFacility_roomId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "guests",
DROP COLUMN "propertyId",
ADD COLUMN     "roomId" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "quantity",
DROP COLUMN "roomType",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "number" VARCHAR NOT NULL,
ADD COLUMN     "roomTypeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "RoomFacility";

-- CreateTable
CREATE TABLE "RoomType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomTypeFacility" (
    "id" SERIAL NOT NULL,
    "roomTypeId" INTEGER NOT NULL,
    "facilityId" INTEGER NOT NULL,

    CONSTRAINT "RoomTypeFacility_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomType" ADD CONSTRAINT "RoomType_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTypeFacility" ADD CONSTRAINT "RoomTypeFacility_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTypeFacility" ADD CONSTRAINT "RoomTypeFacility_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
