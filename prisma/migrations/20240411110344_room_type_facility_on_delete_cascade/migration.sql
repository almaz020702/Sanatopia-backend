-- DropForeignKey
ALTER TABLE "RoomTypeFacility" DROP CONSTRAINT "RoomTypeFacility_roomTypeId_fkey";

-- AddForeignKey
ALTER TABLE "RoomTypeFacility" ADD CONSTRAINT "RoomTypeFacility_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
