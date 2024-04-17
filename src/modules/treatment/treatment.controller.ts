import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TreatmentService } from './treatment.service';
import { Treatment } from './interfaces/treatment.interface';

@ApiTags('Treatment')
@Controller('treatment')
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  @ApiOperation({ summary: 'Get all treatments' })
  @Get()
  async getTreatments(): Promise<Treatment[]> {
    return this.treatmentService.getTreatments();
  }
}
