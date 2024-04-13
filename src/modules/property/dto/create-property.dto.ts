// create-property.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsString, IsArray } from 'class-validator';
import { $Enums } from '@prisma/client';

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  cityId: number;

  @ApiProperty()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  contactName: string;

  @ApiProperty()
  @IsString()
  contactPhone: string;

  @ApiProperty()
  @IsNotEmpty()
  propertyType: $Enums.PropertyType;

  @ApiProperty()
  @IsArray()
  treatments: number[]

  @ApiProperty()
  @IsArray()
  services: number[]
}
