/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/indent */
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { $Enums } from '@prisma/client';
import { OwnerService } from './owner.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { AuthResponse } from '../auth/interfaces/auth-response.interface';
import { Property } from '../property/interfaces/property.interface';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdatePropertyDto } from '../property/dto/update-property.dto';
import { PropertyService } from '../property/property.service';
import { Room } from '../room/interfaces/room.interface';
import { RoomsPaginationQueryDto } from '../room/dto/rooms-pagination.dto';
import { RoomService } from '../room/room.service';
import { CreateRoomDto } from '../room/dto/create-room.dto';
import { UpdateRoomTypeDto } from '../room/dto/update-room-type.dto';
import { RoomType } from '../room/interfaces/room-type.interface';
import { CreateRoomTypeDto } from '../room/dto/create-room-type.dto';
import { Booking } from '../booking/interfaces/booking.interface';
import {
  CreateBookingResponse,
  GetBookingResponse,
} from '../booking/interfaces/booking-response.interface';
import { BookingService } from '../booking/booking.service';
import { CreateBookingDto } from '../booking/dto/create-booking.dto';
import { UpdateBookingDto } from '../booking/dto/update-booking.dto';

@ApiTags('Owner')
@Controller('owner')
export class OwnerController {
  constructor(
    private readonly ownerService: OwnerService,
    private readonly propertyService: PropertyService,
    private readonly roomService: RoomService,
    private readonly bookingService: BookingService,
  ) {}

  @ApiOperation({ summary: 'owner registration' })
  @Post('/registration')
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() userData: CreateUserDto,
  ): Promise<AuthResponse> {
    return this.ownerService.registration(userData, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Get('/properties')
  async getOwnerProperties(@UserId() userId: number): Promise<Property[]> {
    return this.ownerService.getOwnerProperties(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Get('/properties/:id')
  async getPropertyById(
    @UserId() userId: number,
    @Param('id') propertyId: number,
  ): Promise<Property> {
    return this.ownerService.getPropertyById(userId, propertyId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Put('/properties/:id')
  async updateProperty(
    @UserId() userId: number,
    @Param('id') propertyId: number,
    @Body() updatedData: UpdatePropertyDto,
  ): Promise<Property> {
    return this.propertyService.updateProperty(userId, propertyId, updatedData);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Delete('/properties/:id')
  async deleteProperty(
    @UserId() userId: number,
    @Param('id') propertyId: number,
  ): Promise<Property> {
    return this.propertyService.deleteProperty(propertyId, userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Get('/:propertyId/rooms')
  async getPropertyRooms(
    @UserId() userId: number,
    @Param('propertyId') propertyId: number,
    @Query() paginationDto: RoomsPaginationQueryDto,
  ): Promise<Room[]> {
    return this.propertyService.getPropertyRooms(
      propertyId,
      userId,
      paginationDto,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Post('/:propertyId/rooms')
  async addRoom(
    @UserId() userId: number,
    @Param('propertyId') propertyId: number,
    @Body() roomData: CreateRoomDto,
  ): Promise<Room> {
    return this.roomService.addRoom(roomData, userId, propertyId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Get(':propertyId/rooms/:roomId')
  async getPropertyRoomDetails(
    @Param('propertyId') propertyId: number,
    @Param('roomId') roomId: number,
    @UserId() userId: number,
  ): Promise<Room | null> {
    return this.roomService.getRoomDetails(propertyId, roomId, userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Put(':propertyId/room-types/:roomTypeId')
  async updateRoomType(
    @Param('propertyId') propertyId: number,
    @Param('roomTypeId') roomTypeId: number,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
    @UserId() userId: number,
  ): Promise<RoomType> {
    return this.roomService.updateRoomType(
      propertyId,
      roomTypeId,
      updateRoomTypeDto,
      userId,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Get(':propertyId/room-types')
  async getRoomTypes(
    @Param('propertyId') propertyId: number,
  ): Promise<RoomType[]> {
    return this.roomService.getRoomTypes(propertyId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Post(':propertyId/room-types')
  async addRoomType(
    @Body() roomTypeData: CreateRoomTypeDto,
  ): Promise<RoomType> {
    return this.roomService.createRoomType(roomTypeData);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Delete(':propertyId/rooms/:roomId')
  async deleteRoom(
    @Param('propertyId') propertyId: number,
    @Param('roomId') roomId: number,
    @UserId() userId: number,
  ): Promise<void> {
    this.roomService.deleteRoom(propertyId, roomId, userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Delete(':propertyId/room-types/:roomTypeId')
  async deleteRoomType(
    @Param('propertyId') propertyId: number,
    @Param('roomTypeId') roomTypeId: number,
    @UserId() userId: number,
  ): Promise<void> {
    this.roomService.deleteRoomType(propertyId, roomTypeId, userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Get('/bookings')
  async getOwnerBookings(@UserId() ownerId: number): Promise<Booking[]> {
    return this.ownerService.getOwnerBookings(ownerId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Get('/bookings/:bookingId')
  async getBookingDetails(
    @Param('bookingId') bookingId: number,
  ): Promise<GetBookingResponse> {
    return this.bookingService.getBookingById(bookingId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Post('/bookings')
  async createBooking(
    @UserId() ownerId: number,
    @Body() createBookingData: CreateBookingDto,
  ): Promise<CreateBookingResponse> {
    return this.bookingService.createBooking(ownerId, createBookingData);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Post('/bookings/:bookingId')
  async updateBooking(
    @UserId() ownerId: number,
    @Body() newBookingData: UpdateBookingDto,
    @Param('bookingId') bookingId: number,
  ): Promise<CreateBookingResponse> {
    return this.bookingService.updateBooking(
      bookingId,
      ownerId,
      newBookingData,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Put('bookings/:bookingId/status')
  async updateBookingStatus(
    @UserId() ownerId: number,
    @Param('bookingId') bookingId: number,
    @Body('status') status: $Enums.BookingStatus,
  ): Promise<Booking> {
    return this.bookingService.updateBookingStatus(ownerId, bookingId, status);
  }
}
