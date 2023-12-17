/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/indent */
import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OwnerService } from './owner.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { AuthResponse } from '../auth/interfaces/auth-response.interface';

@ApiTags('Owner')
@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @ApiOperation({ summary: 'owner registration' })
  @Post('registration')
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() userData: CreateUserDto,
  ): Promise<AuthResponse> {
    return this.ownerService.registration(userData, res);
  }
}
