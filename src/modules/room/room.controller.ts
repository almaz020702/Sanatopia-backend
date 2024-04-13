/* eslint-disable object-curly-newline */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';

@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @ApiOperation({})
  @Post('/create-room-type')
  async createRoomType(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    return this.roomService.createRoomType(createRoomTypeDto);
  }

  @ApiOperation({})
  @Post('/create-room-types')
  async createRoomTypes(@Body() createRoomTypesDto: CreateRoomTypeDto[]) {
    return this.roomService.createRoomTypes(createRoomTypesDto);
  }

  @ApiOperation({})
  @Get('/room-types/:roomTypeId')
  async getRoomTypeById(@Param('roomTypeId') roomTypeId: number) {
    return this.roomService.getRoomTypeById(roomTypeId);
  }
}
