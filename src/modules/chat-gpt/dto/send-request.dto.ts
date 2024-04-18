import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsDate,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GptRequestDto {
  @ApiProperty({
    description: 'City name',
    example: 'Astana',
  })
  @IsString()
  @IsNotEmpty()
  cityName: string;

  @ApiProperty({
    description: 'The check-in date of the booking',
    example: '2024-05-01T12:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  checkIn: Date;

  @ApiProperty({
    description: 'The check-out date of the booking',
    example: '2024-05-05T12:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  checkOut: Date;
}
