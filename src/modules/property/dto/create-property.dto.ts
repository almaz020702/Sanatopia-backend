// create-property.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { PropertyType } from '../enums/property-type.enum';
import { SanatoriumStatus } from '../enums/sanatorium-status.enum';

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
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  ownerId: string;

  @ApiProperty()
  @IsString()
  contactName: string;

  @ApiProperty()
  @IsString()
  contactPhone: string;

  @ApiProperty({ enum: PropertyType, enumName: 'PropertyType' })
  @IsNotEmpty()
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ enum: SanatoriumStatus, enumName: 'SanatoriumStatus' })
  @IsNotEmpty()
  @IsEnum(SanatoriumStatus)
  @IsOptional()
  status?: SanatoriumStatus;
}
