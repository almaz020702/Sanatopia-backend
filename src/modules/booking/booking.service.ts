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

@Injectable()
export class BookingService {
  constructor(private prismaService: PrismaService) {}

  async createBooking(
    userId: number,
    bookingData: CreateBookingDto,
  ): Promise<CreateBookingResponse> {
    const { roomId, checkIn, checkOut } = bookingData;

    this.validateDates(checkIn, checkOut);

    try {
      const room = await this.prismaService.room.findUnique({
        where: { id: roomId },
        include: { bookings: true, roomType: true },
      });

      if (!room) {
        throw new NotFoundException('Room not found');
      }

      const isRoomAvailable = await this.isRoomAvailableForBooking(
        roomId,
        checkIn,
        checkOut,
      );

      if (!isRoomAvailable) {
        throw new BadRequestException(
          'Room is not available for booking during the specified dates',
        );
      }

      const totalPrice = this.calculateTotalPrice(
        checkIn,
        checkOut,
        room.roomType.pricePerDay,
      );

      const booking = await this.prismaService.booking.create({
        data: {
          userId,
          roomId,
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

  private async isRoomAvailableForBooking(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    if (!(checkIn instanceof Date) || !(checkOut instanceof Date)) {
      throw new Error('Invalid date inputs');
    }

    const query = Prisma.sql`
      SELECT COUNT(*)
      FROM "Booking"
      WHERE "roomId" = ${roomId}
      AND ("checkIn", "checkOut") OVERLAPS (${checkIn}, ${checkOut})
    `;

    const result = await this.prismaService.$queryRaw(query);

    return parseInt(result[0].count, 10) === 0;
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
}
