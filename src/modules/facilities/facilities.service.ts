import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Facility } from './interfaces/facilities.interface';

@Injectable()
export class FacilitiesService {
  constructor(private prismaService: PrismaService) {}

  getFacilities(): Promise<Facility[]> {
    return this.prismaService.facility.findMany();
  }
}
