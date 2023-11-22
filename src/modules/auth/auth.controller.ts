/* eslint-disable @typescript-eslint/indent */
// eslint-disable-next-line object-curly-newline
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { AuthResponse } from './interfaces/auth-response.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: CreateUserDto })
  @Post('/registration')
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() userData: CreateUserDto,
  ): Promise<AuthResponse> {
    return this.authService.registration(userData, res);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: CreateUserDto })
  @Post('/login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() userData: CreateUserDto,
  ): Promise<AuthResponse> {
    return this.authService.login(userData, res);
  }

  @ApiOperation({ summary: 'User logout' })
  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    return this.authService.logout(res);
  }
}
