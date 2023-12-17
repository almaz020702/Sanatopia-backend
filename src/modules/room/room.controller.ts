/* eslint-disable object-curly-newline */
import { Controller, Get, Post, Body } from '@nestjs/common';
import { Room } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomBodyDto } from './dto/create-room-body.dto';
import { CreateRoomResponse } from './interfaces/create-room-response.interface';
import { CreateAllRoomsDto } from './dto/get-all-rooms.dto';

@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @ApiOperation({ summary: 'Get All rooms' })
  @Get('')
  async getAllRooms(
    @Body() { propertyId }: CreateAllRoomsDto,
  ): Promise<Room[]> {
    return this.roomService.getAllRooms(propertyId);
  }

  @ApiOperation({ summary: 'Create a room ' })
  @Post('')
  async createRoom(
    @Body() roomData: CreateRoomBodyDto,
  ): Promise<CreateRoomResponse> {
    return this.roomService.createRoom(roomData);
  }
}
