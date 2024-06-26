import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger'; // Import Swagger decorators
import { CityService } from './city.service';
import { City } from './interfaces/city.interface';

@Controller('cities')
@ApiTags('Cities') // Add a tag for Swagger documentation
export class CityController {
  constructor(private cityService: CityService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all cities',
    description: 'Retrieve a list of all cities.',
  })
  async getCities(): Promise<City[]> {
    return this.cityService.getCities();
  }
}
