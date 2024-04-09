/* eslint-disable import/no-cycle */
import { Property } from 'src/modules/property/interfaces/property.interface';
import { RoomType } from './room-type.interface';

export interface Room {
  id: number;
  roomTypeId: number;
  propertyId: number;
  roomType: RoomType;
  property?: Property;
  // bookings: Booking[];
}
