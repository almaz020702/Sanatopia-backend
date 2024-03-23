/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/indent */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  CreateBookingResponse,
  GetBookingResponse,
} from './interfaces/booking-response.interface';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Post('/create-booking')
  async createBooking(
    @UserId() userId: number,
    @Body() bookingData: CreateBookingDto,
  ): Promise<CreateBookingResponse> {
    return this.bookingService.createBooking(userId, bookingData);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('/:id')
  async getBookingById(@Param('id') id: number): Promise<GetBookingResponse> {
    return this.bookingService.getBookingById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get('/user/bookings')
  async getBookingsByUserId(
    @UserId() userId: number,
  ): Promise<GetBookingResponse[]> {
    return this.bookingService.getBookingsByUserId(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Post('/:id')
  async updateBooking(
    @Param('id') id: number,
    @UserId() userId: number,
    @Body() newBookingData: UpdateBookingDto,
  ): Promise<CreateBookingResponse> {
    return this.bookingService.updateBooking(id, userId, newBookingData);
  }
}
