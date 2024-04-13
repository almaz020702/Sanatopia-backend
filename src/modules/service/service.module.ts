import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
  imports: [PrismaModule],
})
export class ServiceModule {}
