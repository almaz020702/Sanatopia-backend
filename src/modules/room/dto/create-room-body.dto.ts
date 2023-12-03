import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RoomType } from '../enums/room-type.enum';
export class CreateRoomBodyDto {
  @IsEnum(RoomType)
  @IsNotEmpty()
  roomType!: RoomType;

  @IsNumber()
  @IsOptional()
  surfaceArea?: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  capacity!: number;

  @IsNumber()
  @IsNotEmpty()
  propertyId!: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  pricePerDay!: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity!: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  facilities!: number[];
}
