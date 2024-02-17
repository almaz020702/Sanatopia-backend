import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as nodemailer from 'nodemailer';

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
      subject: 'Account Verification',
      html: `Click the following link to verify your account: <a href="${process.env.API_URL}/auth/activation/${verificationToken}">Verify Account</a>`,
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
        subject: 'Reset Password',
        html: `Click the following link to reset the password: <a href="${process.env.API_URL}/auth/reset-password/${resetToken}">Reset Password</a>`,
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
