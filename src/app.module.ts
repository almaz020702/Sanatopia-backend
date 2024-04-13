import {
  BadRequestException,
  Module,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FacilityModule } from './modules/facility/facility.module';
import { RoomModule } from './modules/room/room.module';
import { OwnerModule } from './modules/owner/owner.module';
import { PropertyModule } from './modules/property/property.module';
import { BookingModule } from './modules/booking/booking.module';
import { CityModule } from './modules/city/city.module';
import { PhotoModule } from './modules/photo/photo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    FacilityModule,
    RoomModule,
    OwnerModule,
    PropertyModule,
    BookingModule,
    CityModule,
    PhotoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // disableErrorMessages: true,
        transform: true,
        whitelist: true,
        exceptionFactory: (errors: ValidationError[]): BadRequestException =>
          // eslint-disable-next-line implicit-arrow-linebreak
          new BadRequestException(errors),
      }),
    },
  ],
})
export class AppModule {}
