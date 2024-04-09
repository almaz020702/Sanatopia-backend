import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { PropertyModule } from '../property/property.module';
import { RoomModule } from '../room/room.module';

@Module({
  controllers: [OwnerController],
  providers: [OwnerService],
  imports: [
    AuthModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: `${process.env.JWT_ACCESS_TTL_IN_MINUTES} minutes`,
      },
    }),
    UserModule,
    PropertyModule,
    RoomModule,
  ],
})
export class OwnerModule {}
