import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
  controllers: [PhotoController],
  providers: [PhotoService],
  imports: [PrismaModule],
})
export class PhotoModule {}
