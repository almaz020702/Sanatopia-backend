import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateBookingDto {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  checkIn: Date;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  checkOut: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  roomTypeId: number;
}
