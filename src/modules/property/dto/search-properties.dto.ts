import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class SearchPropertiesDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  readonly cityId: number;

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

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  readonly capacity: number;
}
