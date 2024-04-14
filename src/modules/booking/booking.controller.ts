/* eslint-disable object-curly-newline */
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Post('/create-booking')
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  async createBooking(
    @UserId() userId: number,
    @Body() bookingData: CreateBookingDto,
  ): Promise<CreateBookingResponse> {
    return this.bookingService.createBooking(userId, bookingData);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('/:id')
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking found',
  })
  async getBookingById(@Param('id') id: number): Promise<GetBookingResponse> {
    return this.bookingService.getBookingById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get('/user/bookings')
  @ApiResponse({
    status: 200,
    description: 'List of bookings by user',
  })
  async getBookingsByUserId(
    @UserId() userId: number,
  ): Promise<GetBookingResponse[]> {
    return this.bookingService.getBookingsByUserId(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Post('/:id')
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiBody({ type: UpdateBookingDto })
  @ApiResponse({ status: 201, description: 'Booking updated successfully' })
  async updateBooking(
    @Param('id') id: number,
    @UserId() userId: number,
    @Body() newBookingData: UpdateBookingDto,
  ): Promise<CreateBookingResponse> {
    return this.bookingService.updateBooking(id, userId, newBookingData);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Delete('/:id')
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  async deleteBooking(
    @Param('id') id: number,
    @UserId() userId: number,
  ): Promise<void> {
    await this.bookingService.deleteBooking(id, userId);
  }
}
