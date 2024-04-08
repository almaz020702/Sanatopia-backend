import { Owner } from 'src/modules/owner/interfaces/owner.interface';
import { $Enums } from '@prisma/client';

export interface Property {
  id: number;
  name: string;
  address: string;
  postalCode: string;
  description: string | null;
  ownerId: number;
  propertyType: $Enums.PropertyType;
  rating: number;
  contactName: string;
  contactPhone: string;
  status: $Enums.PropertyStatus;
  owner: Owner;
  //   rooms: Room[];
  //   propertyPhotos: PropertyPhoto[];
  //   propertyServices: PropertyService[];
  //   propertyTreatments: PropertyTreatment[];
  //   roomTypes: RoomType[];
}
