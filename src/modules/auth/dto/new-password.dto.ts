import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty({example: '123456', description: 'Password'})
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
