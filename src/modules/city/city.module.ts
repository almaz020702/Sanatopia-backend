import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { CityController } from './city.controller';
import { CityService } from './city.service';

@Module({
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
  imports: [PrismaModule],
})
export class CityModule {}
