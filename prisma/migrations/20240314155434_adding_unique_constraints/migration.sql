/*
  Warnings:

  - A unique constraint covering the columns `[propertyId,serviceId]` on the table `PropertyServices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[propertyId,treatmentId]` on the table `PropertyTreatments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomTypeId,facilityId]` on the table `RoomTypeFacility` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PropertyServices_propertyId_serviceId_key" ON "PropertyServices"("propertyId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyTreatments_propertyId_treatmentId_key" ON "PropertyTreatments"("propertyId", "treatmentId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomTypeFacility_roomTypeId_facilityId_key" ON "RoomTypeFacility"("roomTypeId", "facilityId");
