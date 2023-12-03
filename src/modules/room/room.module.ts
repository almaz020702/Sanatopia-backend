import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';

@Module({
  providers: [RoomService],
  controllers: [RoomController],
  imports: [PrismaModule],
})
export class RoomModule {}
