import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Treatment } from './interfaces/treatment.interface';

@Injectable()
export class TreatmentService {
  constructor(private prismaService: PrismaService) {}

  async getTreatments(): Promise<Treatment[]> {
    const treatments = this.prismaService.treatment.findMany();
    return treatments;
  }
}
