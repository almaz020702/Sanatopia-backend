import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({example: 'example@gmail.com', description: 'Email address'})
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({example: '123456', description: 'Password'})
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
