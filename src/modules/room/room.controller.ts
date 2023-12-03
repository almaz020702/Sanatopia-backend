/* eslint-disable object-curly-newline */
import { Controller, Get, Post, Body } from '@nestjs/common';
import { Room } from '@prisma/client';
import { RoomService } from './room.service';
import { CreateRoomBodyDto } from './dto/create-room-body.dto';
import { CreateRoomResponse } from './interfaces/create-room-response.interface';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('')
  async getAllRooms(): Promise<Room[]> {
    return this.roomService.getAllRooms();
  }

  @Post('')
  async createRoom(
    @Body() roomData: CreateRoomBodyDto,
  ): Promise<CreateRoomResponse> {
    return this.roomService.createRoom(roomData);
  }
}
