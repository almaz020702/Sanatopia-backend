import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: `${process.env.JWT_ACCESS_TTL_IN_MINUTES} minutes`,
      },
    }),
    UserModule,
  ],
  exports: [BookingService],
})
export class BookingModule {}
