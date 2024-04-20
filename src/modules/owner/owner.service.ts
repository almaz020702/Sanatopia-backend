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
      include: {
        roomTypes: {
          include: { roomTypePhotos: { include: { photo: true } } },
        },
        owner: true,
        propertyServices: { select: { service: true } },
        propertyTreatments: { select: { treatment: true } },
        propertyPhotos: { select: { photo: { select: { url: true } } } },
      },
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

  async getOwnerBookings(ownerId: number) {
    const bookings = await this.prismaService.booking.findMany({
      where: { room: { property: { ownerId } } },
      include: {
        user: true,
        room: { select: { roomType: { select: { capacity: true } } } },
      },
    });

    if (!bookings || bookings.length === 0) {
      throw new NotFoundException('No bookings found for the owner');
    }

    return bookings;
  }
}
