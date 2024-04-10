import { IsOptional, IsString, IsNumber, IsArray, ArrayNotEmpty, ArrayMinSize } from 'class-validator';

export class UpdateRoomTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  surfaceArea?: number;

  @IsOptional()
  @IsNumber()
  pricePerDay?: number;

  @IsOptional()
  @IsNumber()
  propertyId?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;
}
