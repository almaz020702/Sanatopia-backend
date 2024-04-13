import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Service } from './interfaces/service.interface';

@Injectable()
export class ServiceService {
  constructor(private prismaService: PrismaService) {}

  async getServices(): Promise<Service[]> {
    const services = this.prismaService.service.findMany();
    return services;
  }
}
