import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Response } from 'express';
import { UserRoleType } from '../user/enums/user-role.enum';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { AuthResponse } from '../auth/interfaces/auth-response.interface';

@Injectable()
export class OwnerService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  public async registration(
    userData: CreateUserDto,
    res: Response,
  ): Promise<AuthResponse> {
    const user = await this.authService.registration(userData, res);
    const role = await this.prismaService.role.upsert({
      where: { name: UserRoleType.PROPERTY_OWNER },
      update: {},
      create: { name: UserRoleType.PROPERTY_OWNER },
    });
    await this.prismaService.userRoles.create({
      data: { userId: user.user.id, roleId: role.id },
    });
    return user;
  }
}
