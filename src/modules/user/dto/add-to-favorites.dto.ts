import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class AddToFavoritesDto {
  @ApiProperty({})
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  propertyId: number;
}
