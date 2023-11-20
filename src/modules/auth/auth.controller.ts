/* eslint-disable @typescript-eslint/indent */
// eslint-disable-next-line object-curly-newline
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() userDto: CreateUserDto,
  ) {
    return this.authService.registration(userDto, res);
  }
}
