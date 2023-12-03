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
import { FacilitiesModule } from './modules/facilities/facilities.module';
import { RoomModule } from './modules/room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    FacilitiesModule,
    RoomModule,
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
