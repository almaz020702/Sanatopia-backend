import { $Enums } from '@prisma/client';

export interface CreateBookingResponse {
  message: string;
  id: number;
  userId: number;
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: $Enums.BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetBookingResponse {
  id: number;
  userId: number;
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: $Enums.BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
