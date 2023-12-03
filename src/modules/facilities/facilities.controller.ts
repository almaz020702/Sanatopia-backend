import { Controller, Get } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { Facility } from './interfaces/facilities.interface';

@Controller('facilities')
export class FacilitiesController {
  constructor(private facilitiesService: FacilitiesService) {}

  @Get('')
  getFacilities(): Promise<Facility[]> {
    return this.facilitiesService.getFacilities();
  }
}
