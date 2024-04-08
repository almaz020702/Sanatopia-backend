import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Response } from 'express';
import { UserRoleType } from '../user/enums/user-role.enum';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { AuthResponse } from '../auth/interfaces/auth-response.interface';
import { Property } from '../property/interfaces/property.interface';

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
    const role = await this.prismaService.role.findUnique({
      where: { name: UserRoleType.PROPERTY_OWNER },
    });
    if (!role) {
      throw new BadRequestException('Owner was not found');
    }
    await this.prismaService.userRoles.create({
      data: { userId: user.user.id, roleId: role.id },
    });
    return user;
  }

  async getOwnerProperties(ownerId: number): Promise<Property[]> {
    const properties = await this.prismaService.property.findMany({
      where: { ownerId },
      include: { owner: true },
    });

    if (!properties || properties.length === 0) {
      throw new NotFoundException('No properties found for the owner');
    }

    return properties;
  }
}
