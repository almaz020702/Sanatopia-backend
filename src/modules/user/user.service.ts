import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const userRoles = await this.prismaService.userRoles.findMany({
      where: { userId },
      include: { Role: true },
    });

    if (!userRoles || userRoles.length === 0) {
      throw new NotFoundException('User roles not found');
    }

    const roleNames = userRoles.map((userRole) => userRole.Role.name);

    return roleNames;
  }
}
