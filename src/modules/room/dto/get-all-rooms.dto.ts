import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAllRoomsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  propertyId: number;
}
