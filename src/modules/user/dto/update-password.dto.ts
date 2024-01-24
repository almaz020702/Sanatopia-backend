import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: '123456', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  oldPassword: string;

  @ApiProperty({ example: '123456', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
