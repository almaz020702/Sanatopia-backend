import { Controller, Get } from '@nestjs/common';
import { TreatmentService } from './treatment.service';
import { Treatment } from './interfaces/treatment.interface';

@Controller('treatment')
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  @Get()
  async getTreatments(): Promise<Treatment[]> {
    return this.treatmentService.getTreatments();
  }
}
