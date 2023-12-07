import { Controller, Get } from '@nestjs/common';
import { FacilityService } from './facility.service';
import { Facility } from './interfaces/facilities.interface';

@Controller('facility')
export class FacilityController {
  constructor(private facilityService: FacilityService) {}

  @Get('')
  getFacilities(): Promise<Facility[]> {
    return this.facilityService.getFacilities();
  }
}
