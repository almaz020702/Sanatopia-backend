/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/indent */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Post('/create-booking')
  async createBooking(
    @UserId() userId: number,
    @Body() bookingData: CreateBookingDto,
  ) {
    return this.bookingService.createBooking(userId, bookingData);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  async getBookingById(@Param('id') id: number) {
    return this.bookingService.getBookingById(id);
  }
}
