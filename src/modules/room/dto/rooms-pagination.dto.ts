import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoomsPaginationQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    description: 'Limit of items per page',
    required: false,
    default: 10,
    maximum: 100,
  })
  @IsNumber()
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  limit: number = 10;
}
