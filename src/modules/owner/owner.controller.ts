/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/indent */
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
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
import { UpdatePropertyDto } from '../property/dto/update-property.dto';
import { PropertyService } from '../property/property.service';

@ApiTags('Owner')
@Controller('owner')
export class OwnerController {
  constructor(
    private readonly ownerService: OwnerService,
    private readonly propertyService: PropertyService,
  ) {}

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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Get('/properties/:id')
  async getPropertyById(
    @UserId() userId: number,
    @Param('id') propertyId: number,
  ): Promise<Property> {
    return this.ownerService.getPropertyById(userId, propertyId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Put('/properties/:id')
  async updateProperty(
    @UserId() userId: number,
    @Param('id') propertyId: number,
    @Body() updatedData: UpdatePropertyDto,
  ): Promise<Property> {
    return this.propertyService.updateProperty(userId, propertyId, updatedData);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Delete('/properties/:id')
  async deleteProperty(
    @UserId() userId: number,
    @Param('id') propertyId: number,
  ): Promise<Property> {
    return this.propertyService.deleteProperty(propertyId, userId);
  }
}
