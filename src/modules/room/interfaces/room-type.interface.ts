import { Property } from 'src/modules/property/interfaces/property.interface';
import { Room } from './room.interface';

export interface RoomType {
  id: number;
  name: string;
  description?: string;
  surfaceArea: number;
  pricePerDay: number;
  propertyId: number;
  capacity: number;
  property?: Property;
  rooms?: Room[];
  // roomTypeFacilities: RoomTypeFacility[];
}
