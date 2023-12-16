import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerificationService } from './email-verification.service';

@Module({
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_VERIFICATION_SECRET,
      signOptions: {
        expiresIn: `${process.env.JWT_VERIFICATION_TTL_IN_MINUTES} minutes`,
      },
    }),
    PrismaModule,
  ],
})
export class EmailVerificationModule {}
