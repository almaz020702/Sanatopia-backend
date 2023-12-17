import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FacilityService } from './facility.service';
import { Facility } from './interfaces/facilities.interface';

@ApiTags('Facility')
@Controller('facility')
export class FacilityController {
  constructor(private facilityService: FacilityService) {}

  @ApiOperation({ summary: 'Get facilities' })
  @Get('')
  getFacilities(): Promise<Facility[]> {
    return this.facilityService.getFacilities();
  }
}
