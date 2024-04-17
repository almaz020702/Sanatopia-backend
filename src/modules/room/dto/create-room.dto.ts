import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  roomTypeId: number;
}
