-- CreateTable
CREATE TABLE "RoomTypePhoto" (
    "id" SERIAL NOT NULL,
    "roomTypeId" INTEGER NOT NULL,
    "photoId" INTEGER NOT NULL,

    CONSTRAINT "RoomTypePhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoomTypePhoto" ADD CONSTRAINT "RoomTypePhoto_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTypePhoto" ADD CONSTRAINT "RoomTypePhoto_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
