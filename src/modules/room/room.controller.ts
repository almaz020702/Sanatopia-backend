/* eslint-disable object-curly-newline */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { RoomType } from './interfaces/room-type.interface';

@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @ApiOperation({ summary: 'Create a new room type' })
  @Post('/create-room-type')
  async createRoomType(
    @Body() createRoomTypeDto: CreateRoomTypeDto,
  ): Promise<RoomType> {
    return this.roomService.createRoomType(createRoomTypeDto);
  }

  @ApiOperation({ summary: 'Create multiple room types' })
  @Post('/create-room-types')
  async createRoomTypes(
    @Body() createRoomTypesDto: CreateRoomTypeDto[],
  ): Promise<RoomType[]> {
    return this.roomService.createRoomTypes(createRoomTypesDto);
  }

  @ApiOperation({ summary: 'Get a room type by ID' })
  @Get('/room-types/:roomTypeId')
  async getRoomTypeById(
    @Param('roomTypeId') roomTypeId: number,
  ): Promise<RoomType> {
    return this.roomService.getRoomTypeById(roomTypeId);
  }
}
