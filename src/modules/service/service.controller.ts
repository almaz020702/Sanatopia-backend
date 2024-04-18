import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServiceService } from './service.service';
import { Service } from './interfaces/service.interface';

@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @ApiOperation({ summary: 'Get all services' })
  @Get()
  async getServices(): Promise<Service[]> {
    return this.serviceService.getServices();
  }
}
