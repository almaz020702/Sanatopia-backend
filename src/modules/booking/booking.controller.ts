/* eslint-disable @typescript-eslint/indent */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Post('/create-booking')
  async createBooking(
    @UserId() userId: number,
    @Body() bookingData: CreateBookingDto,
  ): Promise<CreateBookingResponse> {
    return this.bookingService.createBooking(userId, bookingData);
  }

  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('/:id')
  async getBookingById(@Param('id') id: number): Promise<GetBookingResponse> {
    return this.bookingService.getBookingById(id);
  }

  @ApiOperation({ summary: 'Get bookings by user ID' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get('/user/bookings')
  async getBookingsByUserId(
    @UserId() userId: number,
  ): Promise<GetBookingResponse[]> {
    return this.bookingService.getBookingsByUserId(userId);
  }

  @ApiOperation({ summary: 'Update a booking by ID' })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Delete a booking by ID' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Delete('/:id')
  async deleteBooking(
    @Param('id') id: number,
    @UserId() userId: number,
  ): Promise<void> {
    await this.bookingService.deleteBooking(id, userId);
  }
}
