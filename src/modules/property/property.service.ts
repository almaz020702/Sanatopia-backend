/* eslint-disable prefer-const */
/* eslint-disable operator-linebreak */
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
    const { cityId, checkIn, checkOut, capacity, propertyType, sort } =
      searchProperties;

    const where: any = {};

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (cityId) {
      where.city = {
        id: cityId,
      };
    }

    if (capacity && (!checkIn || !checkOut)) {
      where.rooms = {
        some: {
          roomType: {
            capacity: {
              gte: capacity,
            },
          },
        },
      };
    } else if (!capacity && checkIn && checkOut) {
      where.rooms = {
        some: {
          bookings: {
            none: {
              AND: [
                { checkIn: { lt: checkOut } },
                { checkOut: { gt: checkIn } },
              ],
            },
          },
        },
      };
    } else if (capacity && checkIn && checkOut) {
      where.rooms = {
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
                    { checkIn: { lt: checkOut } },
                    { checkOut: { gt: checkIn } },
                  ],
                },
              },
            },
          ],
        },
      };
    }

    const orderBy = this.getOrderBy(sort);

    const properties = await this.prismaService.property.findMany({
      where,
      orderBy,
      include: {
        roomTypes: { select: { pricePerDay: true } },
        propertyPhotos: { select: { photo: { select: { id: true } } } },
        city: true,
      },
    });

    const propertiesWithMinPricePerDay = properties.map((property) => {
      const minPricePerDay = Math.min(
        ...property.roomTypes.map((roomType) => roomType.pricePerDay),
      );
      return { ...property, minPricePerDay };
    });

    return propertiesWithMinPricePerDay;
  }

  private getOrderBy(sort: string): Record<string, 'asc' | 'desc'> | undefined {
    if (!sort) {
      return undefined;
    }

    const allowedSortFields = ['name', 'price', 'createdAt', 'rating'];

    const [field, order] = sort.split(':');

    if (allowedSortFields.includes(field) && ['asc', 'desc'].includes(order)) {
      let dynamicOrder = {};
      dynamicOrder[field] = order;
      return dynamicOrder;
    }

    return undefined;
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

    const { services, treatments, ...rest } = updatePropertyDto;

    const dataToUpdate: any = { ...rest };

    if (services !== undefined) {
      await this.prismaService.propertyServices.deleteMany({
        where: { propertyId: property.id },
      });

      dataToUpdate.propertyServices = {
        createMany: {
          data: services.map((serviceId) => ({
            serviceId,
            price: 0,
          })),
        },
      };
    }

    if (treatments !== undefined) {
      await this.prismaService.propertyTreatments.deleteMany({
        where: { propertyId: property.id },
      });

      dataToUpdate.propertyTreatments = {
        createMany: {
          data: treatments.map((treatmentId) => ({
            treatmentId,
            price: 0,
          })),
        },
      };
    }

    const updatedProperty = await this.prismaService.property.update({
      where: { id },
      data: dataToUpdate,
      include: {
        owner: true,
        propertyServices: { select: { service: true } },
        propertyTreatments: { select: { treatment: true } },
      },
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

  async getPropertyById(propertyId: number) {
    const property = await this.prismaService.property.findUnique({
      where: { id: propertyId },
      include: {
        roomTypes: true,
        propertyServices: { select: { service: true } },
        propertyTreatments: { select: { treatment: true } },
        propertyPhotos: { select: { photo: { select: { id: true } } } },
        city: true,
        owner: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    const minPricePerDay = Math.min(
      ...property.roomTypes.map((roomType) => roomType.pricePerDay),
    );

    return { ...property, minPricePerDay };
  }
}
