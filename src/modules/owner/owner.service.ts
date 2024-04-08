import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Response } from 'express';
import { UserRoleType } from '../user/enums/user-role.enum';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { AuthResponse } from '../auth/interfaces/auth-response.interface';
import { Property } from '../property/interfaces/property.interface';
import { UpdatePropertyDto } from '../property/dto/update-property.dto';

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

  async getPropertyById(ownerId: number, id: number): Promise<Property> {
    const property = await this.prismaService.property.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.owner.id !== ownerId) {
      throw new UnauthorizedException(
        'You are not authorized to access this property',
      );
    }

    return property;
  }

  async updateProperty(
    ownerId: number,
    id: number,
    updatePropertyDto: UpdatePropertyDto,
  ) {
    const property = await this.prismaService.property.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.ownerId !== ownerId) {
      throw new UnauthorizedException(
        'You are not authorized to update this property',
      );
    }

    const updatedProperty = await this.prismaService.property.update({
      where: { id },
      data: updatePropertyDto,
      include: { owner: true },
    });

    return updatedProperty;
  }
}
