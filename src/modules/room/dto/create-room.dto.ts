import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsInt()
  @IsNotEmpty()
  roomTypeId: number;
}
