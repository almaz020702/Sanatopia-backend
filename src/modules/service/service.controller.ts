import { Controller, Get } from '@nestjs/common';
import { ServiceService } from './service.service';
import { Service } from './interfaces/service.interface';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async getServices(): Promise<Service[]> {
    return this.serviceService.getServices();
  }
}
