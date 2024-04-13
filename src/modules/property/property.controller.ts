/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/indent */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyService } from './property.service';
import { AuthGuard } from '../auth/guards/auth.guard';

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
}
