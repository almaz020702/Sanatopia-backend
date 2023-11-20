import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  readonly email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  readonly password: string;
}
