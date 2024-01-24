import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;
}
