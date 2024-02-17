/* eslint-disable operator-linebreak */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenPair } from './interfaces/token-pair.interface';
import { User } from '../user/interfaces/user.interface';
import { AuthResponse } from './interfaces/auth-response.interface';
import { UserService } from '../user/user.service';
import { EmailVerificationService } from '../email-verification/email-verification.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
    private emailVerificationService: EmailVerificationService,
  ) {}

  async registration(
    userData: CreateUserDto,
    res: Response,
  ): Promise<AuthResponse> {
    const candidate = await this.userService.findUserByEmail(userData.email);
    if (candidate) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 5);
    const user = await this.prismaService.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        UserRoles: {
          create: {
            Role: {
              connectOrCreate: {
                where: {
                  name: 'USER',
                },
                create: {
                  name: 'USER',
                },
              },
            },
          },
        },
      },
    });

    const tokens = this.generateTokens(user);
    this.sendTokensInCookie(tokens, res);

    // eslint-disable-next-line operator-linebreak
    const activationToken =
      await this.emailVerificationService.generateActivationToken(
        userData.email,
      );
    await this.emailVerificationService.sendVerificationEmail(
      user.email,
      activationToken,
    );

    return {
      message: 'User registration successful',
      user: {
        email: user.email,
        id: user.id,
      },
      tokens,
    };
  }

  private generateTokens(user: User): TokenPair {
    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
    const refreshToken = this.jwtService.sign({ email: user.email });
    return { accessToken, refreshToken };
  }

  private sendTokensInCookie(
    tokens: { accessToken: string; refreshToken: string },
    res: Response,
  ): void {
    res.cookie('accessToken', tokens.accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
    });
  }

  async login(userData: CreateUserDto, res: Response): Promise<AuthResponse> {
    const candidate = await this.userService.findUserByEmail(userData.email);
    if (!candidate) {
      throw new BadRequestException('User with this email does not exist');
    }

    const comparePassword = bcrypt.compareSync(
      userData.password,
      candidate.password,
    );
    if (!comparePassword) {
      throw new BadRequestException('Incorrect password');
    }

    const tokens = this.generateTokens(candidate);
    this.sendTokensInCookie(tokens, res);

    return {
      message: 'User login successful',
      user: {
        email: candidate.email,
        id: candidate.id,
      },
      tokens,
    };
  }

  async logout(res: Response): Promise<{ message: string }> {
    this.clearTokensInCookie(res);
    return { message: 'User successfully logged out' };
  }

  private clearTokensInCookie(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  async refreshTokens(userId: number, res: Response): Promise<AuthResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    const tokens = this.generateTokens(user);
    this.sendTokensInCookie(tokens, res);

    return {
      message: 'Tokens were refreshed successfully',
      user: {
        email: user.email,
        id: user.id,
      },
      tokens,
    };
  }

  async sendResetPasswordEmail(email: string): Promise<boolean> {
    return this.emailVerificationService.sendForgotPasswordEmail(email);
  }

  async validateResetToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.decode(token);

      const verification = this.jwtService.verify(token, {
        secret: process.env.JWT_RESET_PASSWORD_SECRET,
      });

      if (decoded && decoded.email && verification) {
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  async renderResetPasswordPage(token: string): Promise<boolean> {
    const isValidToken = await this.validateResetToken(token);

    if (!isValidToken) {
      return false;
    }

    return true;
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const isValidToken = await this.validateResetToken(resetToken);
    if (!isValidToken) {
      throw new NotFoundException('Invalid or expired token');
    }

    const decoded = this.jwtService.decode(resetToken);

    const hashedPassword = await bcrypt.hash(newPassword, 5);

    await this.prismaService.user.update({
      where: { email: decoded.email },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password was successfully updated' };
  }
}
