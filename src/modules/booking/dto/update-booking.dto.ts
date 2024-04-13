import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingDto {
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

  @ApiProperty({
    description: 'The ID of the room type for the booking (optional)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  roomTypeId: number;
}
