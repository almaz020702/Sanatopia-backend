import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomTypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  surfaceArea: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pricePerDay: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  capacity: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  propertyId: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  facilityIds: number[];

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
