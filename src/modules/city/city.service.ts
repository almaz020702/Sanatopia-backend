import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { City } from './interfaces/city.interface';

@Injectable()
export class CityService {
  constructor(private prismaService: PrismaService) {}

  async getCities(): Promise<City[]> {
    const cities = this.prismaService.city.findMany();

    if (!cities) {
      throw new NotFoundException('No cities were found');
    }

    return cities;
  }
}
