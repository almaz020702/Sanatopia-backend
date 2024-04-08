/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/indent */
import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { OwnerService } from './owner.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { AuthResponse } from '../auth/interfaces/auth-response.interface';
import { Property } from '../property/interfaces/property.interface';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Owner')
@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @ApiOperation({ summary: 'owner registration' })
  @Post('/registration')
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() userData: CreateUserDto,
  ): Promise<AuthResponse> {
    return this.ownerService.registration(userData, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Get('/properties')
  async getOwnerProperties(@UserId() userId: number): Promise<Property[]> {
    return this.ownerService.getOwnerProperties(userId);
  }
}
