/* eslint-disable object-curly-newline */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PropertyCreateRespnse } from './interfaces/property-create-response.interface';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './interfaces/property.interface';
import { Room } from '../room/interfaces/room.interface';
import { RoomsPaginationQueryDto } from '../room/dto/rooms-pagination.dto';
import { SearchPropertiesDto } from './dto/search-properties.dto';

@Injectable()
export class PropertyService {
  constructor(private prismaService: PrismaService) {}

  async getProperties(searchProperties: SearchPropertiesDto) {
    const { cityId, checkIn, checkOut, capacity } = searchProperties;
    const properties = await this.prismaService.property.findMany({
      where: {
        city: {
          id: cityId,
        },
        rooms: {
          some: {
            AND: [
              {
                roomType: {
                  capacity: {
                    gte: capacity,
                  },
                },
                bookings: {
                  none: {
                    AND: [
                      { checkIn: { lte: checkOut } },
                      { checkOut: { gte: checkIn } },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      include: { roomTypes: { select: { pricePerDay: true } } },
    });

    const propertiesWithMinPricePerDay = properties.map((property) => {
      const minPricePerDay = Math.min(
        ...property.roomTypes.map((roomType) => roomType.pricePerDay),
      );
      return { ...property, minPricePerDay };
    });

    return propertiesWithMinPricePerDay;
  }

  async createProperty(
    propertyData: CreatePropertyDto,
    ownerId: number,
  ): Promise<PropertyCreateRespnse> {
    if (
      await this.prismaService.property.findFirst({
        where: { name: propertyData.name },
      })
    ) {
      throw new BadRequestException(' property with such name already exists');
    }

    const {
      treatments,
      services,
      ...propertyDataWithoutTreatmentsAndFacilities
    } = propertyData;

    const property = await this.prismaService.property.create({
      data: {
        ...propertyDataWithoutTreatmentsAndFacilities,
        ownerId,
        propertyTreatments: {
          createMany: {
            data: treatments?.map((treatmentId) => ({
              treatmentId,
            })),
          },
        },
        propertyServices: {
          createMany: {
            data: services?.map((facilityId) => ({
              serviceId: facilityId,
            })),
          },
        },
      },
    });
    return {
      propertyId: property.id,
      ownerId,
      message: 'You registered the property successfully',
    };
  }

  async updateProperty(
    ownerId: number,
    id: number,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
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

  async deleteProperty(propertyId: number, ownerId: number): Promise<Property> {
    const property = await this.prismaService.property.findUnique({
      where: { id: propertyId },
      include: { owner: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.owner.id !== ownerId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this property',
      );
    }

    const deletedProperty = await this.prismaService.property.delete({
      where: { id: propertyId },
      include: { owner: true },
    });

    return deletedProperty;
  }

  async getPropertyRooms(
    propertyId: number,
    ownerId: number,
    paginationDto: RoomsPaginationQueryDto,
  ): Promise<Room[]> {
    const offset = (paginationDto.page - 1) * paginationDto.limit;

    const property = await this.prismaService.property.findUnique({
      where: { id: propertyId },
      include: {
        rooms: {
          include: { roomType: true },
          skip: offset,
          take: paginationDto.limit,
        },
        owner: true,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.owner.id !== ownerId) {
      throw new UnauthorizedException('Unauthorized access to property rooms');
    }

    return property.rooms;
  }
}
