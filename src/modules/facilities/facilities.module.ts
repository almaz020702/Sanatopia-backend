import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';

@Module({
  providers: [FacilitiesService],
  controllers: [FacilitiesController],
  imports: [PrismaModule],
})
export class FacilitiesModule {}
