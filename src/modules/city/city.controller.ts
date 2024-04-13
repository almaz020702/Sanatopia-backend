import { Controller, Get } from '@nestjs/common';
import { CityService } from './city.service';
import { City } from './interfaces/city.interface';

@Controller('cities')
export class CityController {
  constructor(private cityService: CityService) {}

  @Get()
  async getCities(): Promise<City[]> {
    return this.cityService.getCities();
  }
}
