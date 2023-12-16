import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [OwnerController],
  providers: [OwnerService],
  imports: [AuthModule, PrismaModule],
})
export class OwnerModule {}
