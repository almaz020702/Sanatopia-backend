import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  CreateBookingResponse,
  GetBookingResponse,
} from './interfaces/booking-response.interface';
import { Room } from '../room/interfaces/room.interface';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './interfaces/booking.interface';

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

  async updateBooking(
    id: number,
    userId: number,
    newBookingData: UpdateBookingDto,
  ): Promise<CreateBookingResponse> {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
      include: { room: { include: { property: true } }, user: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId && booking.room.property.ownerId !== userId) {
      throw new BadRequestException(
        'You are not authorized to update this booking',
      );
    }

    this.validateDates(newBookingData.checkIn, newBookingData.checkOut);

    const data = await this.prepareUpdateData(newBookingData);

    const updatedBooking = await this.prismaService.booking.update({
      where: { id: booking.id },
      data,
    });

    return { message: 'success', ...updatedBooking };
  }

  private async prepareUpdateData(
    newBookingData: UpdateBookingDto,
  ): Promise<Prisma.BookingUpdateInput> {
    const data: Prisma.BookingUpdateInput = {};

    if (newBookingData.roomTypeId) {
      const availableRoom = await this.findAvailableRoom(
        newBookingData.roomTypeId,
        newBookingData.checkIn,
        newBookingData.checkOut,
      );

      if (!availableRoom) {
        throw new BadRequestException(
          'No available rooms found for the specified dates',
        );
      }

      data.room = { connect: { id: availableRoom.id } };

      const roomType = await this.prismaService.roomType.findUnique({
        where: { id: newBookingData.roomTypeId },
      });

      const totalPrice = this.calculateTotalPrice(
        newBookingData.checkIn,
        newBookingData.checkOut,
        roomType.pricePerDay,
      );
      data.totalPrice = totalPrice;
    }

    data.checkIn = newBookingData.checkIn;
    data.checkOut = newBookingData.checkOut;

    return data;
  }

  async deleteBooking(id: number, userId: number): Promise<void> {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this booking',
      );
    }

    await this.prismaService.booking.delete({ where: { id } });
  }

  async updateBookingStatus(
    ownerId: number,
    bookingId: number,
    status: $Enums.BookingStatus,
  ): Promise<Booking> {
    const booking = await this.prismaService.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: { include: { property: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.room.property.ownerId !== ownerId) {
      throw new UnauthorizedException(
        'Unauthorized access to update booking status',
      );
    }

    return this.prismaService.booking.update({
      where: { id: bookingId },
      data: {
        status,
      },
      include: {
        user: true,
        room: true,
        propertyServices: true,
        propertyTreatments: true,
      },
    });
  }
}
