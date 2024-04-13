import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class SearchPropertiesDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  readonly cityId?: number;

  @ApiProperty({
    description: 'The check-in date of the booking',
    example: '2024-05-01T12:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  checkIn: Date;

  @ApiProperty({
    description: 'The check-out date of the booking',
    example: '2024-05-05T12:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  checkOut: Date;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  readonly capacity?: number;

  @ApiProperty()
  @IsOptional()
  propertyType?: $Enums.PropertyType;

  @ApiProperty({
    description: 'The sorting criteria',
    example: { field: 'name', order: 'asc' },
  })
  @IsOptional()
  sort: string;
}
