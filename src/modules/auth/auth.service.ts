import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenPair } from './interfaces/token-pair.interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registration(userData: CreateUserDto, res: Response) {
    const candidate = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (candidate) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 5);
    const user = await this.prismaService.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
      },
    });
    const tokens = this.generateTokens(user);
    this.sendTokensInCookie(tokens, res);
    return {
      message: 'User registration successful',
      user: {
        id: user.id,
        email: user.email,
      },
      tokens,
    };
  }

  private generateTokens(user): TokenPair {
    const accessToken = this.jwtService.sign({
      id: user.user_id,
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
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
    });
  }
}
