import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RoomType } from '../enums/room-type.enum';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRoomBodyDto {
  @ApiProperty()
  @IsEnum(RoomType)
  @IsNotEmpty()
  roomType!: RoomType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  surfaceArea?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  capacity!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  propertyId!: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  pricePerDay!: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity!: number;

  @ApiProperty({ example: [1, 2, 3, 4] })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  facilities!: number[];
}
