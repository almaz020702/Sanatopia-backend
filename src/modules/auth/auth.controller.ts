/* eslint-disable @typescript-eslint/indent */
// eslint-disable-next-line object-curly-newline
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { AuthResponse } from './interfaces/auth-response.interface';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { GetUserEmailDto } from './dto/user-email.dto';
import { NewPasswordDto } from './dto/new-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailVerificationService: EmailVerificationService,
  ) {}

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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    return this.authService.logout(res);
  }

  @ApiOperation({ summary: 'Refreshing the tokens' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Post('/refreshTokens')
  async refreshTokens(
    @UserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokens(userId, res);
  }

  @ApiOperation({ summary: 'Account Activation' })
  @Get('/activation/:activationToken')
  async activateAccount(@Param('activationToken') activationToken: string) {
    return this.emailVerificationService.activateAccount(activationToken);
  }

  @ApiOperation({})
  @Post('/reset-password')
  async sendResetPasswordEmail(
    @Body() userData: GetUserEmailDto,
  ): Promise<boolean> {
    return this.authService.sendResetPasswordEmail(userData.email);
  }

  @ApiOperation({})
  @Get('reset-password/:token')
  async renderResetPasswordPage(
    @Param('token') token: string,
  ): Promise<boolean> {
    return this.authService.renderResetPasswordPage(token);
  }

  @ApiOperation({})
  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() passwordData: NewPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(token, passwordData.password);
  }
}
