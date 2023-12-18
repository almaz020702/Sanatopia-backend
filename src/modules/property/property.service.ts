import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PropertyCreateRespnse } from './interfaces/property-create-response.interface';
import { CreatePropertyDto } from './dto/create-property.dto';

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
}
