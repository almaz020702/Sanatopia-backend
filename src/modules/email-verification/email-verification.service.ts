import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { EMAIL_BODY, EMAIL_SUBJECT } from './email.constants';

@Injectable()
export class EmailVerificationService {
  private transporter;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    verificationToken: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject: EMAIL_SUBJECT.SUBJECT_VERIFICATION,
      html: EMAIL_BODY.BODY_VERIFICATION(verificationToken),
    };

    await this.transporter.sendMail(mailOptions);
  }

  async generateActivationToken(email: string): Promise<string> {
    const token = this.jwtService.sign({ email });

    return token;
  }

  async decodeActivationToken(token: string): Promise<string | null> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded.email;
    } catch (error) {
      return null;
    }
  }

  async activateAccount(activationToken: string) {
    const email = await this.decodeActivationToken(activationToken);
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('User was not fount');
    }

    const activatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        isActivated: true,
      },
    });

    return activatedUser;
  }

  async sendForgotPasswordEmail(to: string): Promise<boolean> {
    try {
      const resetToken = await this.generateResetPasswordToken(to);
      const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject: EMAIL_SUBJECT.SUBJECT_RESET_PASSWORD,
        html: EMAIL_BODY.BODY_RESET_PASSWORD(resetToken),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (e) {
      return false;
    }
  }

  async generateResetPasswordToken(email: string): Promise<string> {
    const token = this.jwtService.sign(
      { email },
      {
        secret: process.env.JWT_RESET_PASSWORD_SECRET,
        expiresIn: `${process.env.JWT_RESET_PASSWORD_TTL_IN_MINUTES}m`,
      },
    );

    return token;
  }
}
