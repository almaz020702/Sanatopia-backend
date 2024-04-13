import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsDateString,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'The ID of the room type for the booking',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  roomTypeId: number;

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
