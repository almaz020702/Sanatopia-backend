import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetUserEmailDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
