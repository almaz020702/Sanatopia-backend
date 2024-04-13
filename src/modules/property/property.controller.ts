/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/indent */
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyService } from './property.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SearchPropertiesDto } from './dto/search-properties.dto';

@ApiTags('Property')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @ApiOperation({ summary: 'Creating property' })
  @Post('')
  @UseGuards(AuthGuard)
  async create(
    @Body() propertyData: CreatePropertyDto,
    @UserId() userId: number,
  ) {
    return this.propertyService.createProperty(propertyData, userId);
  }

  @ApiOperation({ summary: 'Getting properties' })
  @Get()
  async getProperties(@Query() searchProperties?: SearchPropertiesDto) {
    return this.propertyService.getProperties(searchProperties);
  }
}
