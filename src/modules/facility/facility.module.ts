import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { FacilityService } from './facility.service';
import { FacilityController } from './facility.controller';

@Module({
  providers: [FacilityService],
  controllers: [FacilityController],
  imports: [PrismaModule],
})
export class FacilityModule {}
