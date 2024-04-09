import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max } from 'class-validator';

export class RoomsPaginationQueryDto {
	@IsNumber()
	@Transform(({ value }) => parseInt(value, 10))
	@IsOptional()
	page: number = 1;

	@IsNumber()
	@Max(100)
	@Transform(({ value }) => parseInt(value, 10))
	@IsOptional()
	limit: number = 10;
}