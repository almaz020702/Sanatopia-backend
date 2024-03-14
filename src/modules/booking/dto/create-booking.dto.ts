import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsDateString, ValidateNested, IsDate } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @IsNotEmpty()
  roomId: number;

  @IsDate()
  @IsNotEmpty()
  @Transform(({value}) => new Date(value))
  checkIn: Date;

  @IsDate()
  @IsNotEmpty()
  @Transform(({value}) => new Date(value))
  checkOut: Date;
}
