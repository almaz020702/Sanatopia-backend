import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomBodyDto {
  @ApiProperty({ example: 'Room Number' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'Room Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Room Description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  roomTypeId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  propertyId: number;

  @ApiProperty({ example: 25.5 })
  @IsNumber()
  surfaceArea: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  pricePerDay: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  capacity: number;

  @ApiProperty({ example: [1, 2, 3, 4] })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  facilities: number[];
}
