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

@Injectable()
export class PropertyService {
  constructor(private prismaService: PrismaService) {}

  async create(
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
    const property = await this.prismaService.property.create({
      data: { ...propertyData, ownerId },
    });
    return {
      propertyId: property.id,
      ownerId,
      message: 'you registered property succesfully',
    };
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
