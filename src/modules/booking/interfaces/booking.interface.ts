import { $Enums } from '@prisma/client';
import { Room } from 'src/modules/room/interfaces/room.interface';
import { User } from 'src/modules/user/interfaces/user.interface';

export interface Booking {
  id: number;
  userId: number;
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: $Enums.BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  room?: Room;
  //   propertyServices?: PropertyService[];
  //   propertyTreatments?: PropertyTreatment[];
}
