import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  CreateBookingResponse,
  GetBookingResponse,
} from './interfaces/booking-response.interface';
import { Room } from '../room/interfaces/room.interface';

@Injectable()
export class BookingService {
  constructor(private prismaService: PrismaService) {}

  async createBooking(
    userId: number,
    bookingData: CreateBookingDto,
  ): Promise<CreateBookingResponse> {
    const { roomTypeId, checkIn, checkOut } = bookingData;

    this.validateDates(checkIn, checkOut);

    try {
      const room = await this.findAvailableRoom(roomTypeId, checkIn, checkOut);

      const roomType = await this.prismaService.roomType.findUnique({
        where: { id: room.roomTypeId },
      });

      const totalPrice = this.calculateTotalPrice(
        checkIn,
        checkOut,
        roomType.pricePerDay,
      );

      const booking = await this.prismaService.booking.create({
        data: {
          userId,
          roomId: room.id,
          checkIn,
          checkOut,
          totalPrice,
        },
      });

      return { message: 'success', ...booking };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create booking: ${error.message}`,
      );
    }
  }

  private async findAvailableRoom(
    roomTypeId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<Room> {
    const query = Prisma.sql`
    SELECT "Room".*
    FROM "Room"
    LEFT JOIN "Booking" ON "Room"."id" = "Booking"."roomId"
    WHERE  "Room"."roomTypeId" = ${roomTypeId}
    AND (("Booking"."id" IS NULL)
         OR 
         "Booking"."roomId" NOT IN
         (SELECT "roomId" 
          FROM "Booking" 
          WHERE ("Booking"."checkIn", "Booking"."checkOut") OVERLAPS (${checkIn}, ${checkOut})))
    LIMIT 1
    `;

    const availableRooms = await this.prismaService.$queryRaw<Room[]>(query);

    if (availableRooms.length === 0) {
      throw new BadRequestException('No available rooms found for booking');
    }

    return availableRooms[0];
  }

  private calculateTotalPrice(
    checkIn: Date,
    checkOut: Date,
    pricePerDay: number,
  ): number {
    const durationInDays = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24),
    );
    return durationInDays * pricePerDay;
  }

  private validateDates(checkIn: Date, checkOut: Date): void {
    if (checkIn >= checkOut) {
      throw new BadRequestException(
        'Check-out date must be after check-in date',
      );
    }

    const today = new Date();
    if (checkIn < today || checkOut < today) {
      throw new BadRequestException('Booking dates cannot be in the past');
    }
  }

  async getBookingById(id: number): Promise<GetBookingResponse> {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async getBookingsByUserId(userId: number): Promise<GetBookingResponse[]> {
    const bookings = await this.prismaService.booking.findMany({
      where: { userId },
    });

    if (!bookings || bookings.length === 0) {
      throw new NotFoundException('No bookings found for the user');
    }

    return bookings;
  }
}
