import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateRoomTypeDto {
  @ApiProperty({ description: 'Name of the room type', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Description of the room type', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Surface area of the room type',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  surfaceArea?: number;

  @ApiProperty({
    description: 'Price per day of the room type',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  pricePerDay?: number;

  @ApiProperty({
    description: 'ID of the property associated with the room type',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  propertyId?: number;

  @ApiProperty({ description: 'Capacity of the room type', required: false })
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  facilityIds: number[];
}
