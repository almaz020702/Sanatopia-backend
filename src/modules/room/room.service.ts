/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}

  async createRoomType(createRoomTypeDto: CreateRoomTypeDto) {
    const {
      name,
      description,
      surfaceArea,
      pricePerDay,
      capacity,
      quantity,
      propertyId,
      facilityIds,
    } = createRoomTypeDto;

    let createdRoomType;

    await this.prismaService.$transaction(async (tx) => {
      createdRoomType = await tx.roomType.create({
        data: {
          name,
          description,
          surfaceArea,
          pricePerDay,
          capacity,
          property: { connect: { id: propertyId } },
        },
        include: { rooms: true },
      });

      for (let i = 0; i < quantity; i += 1) {
        await tx.room.create({
          data: {
            roomType: { connect: { id: createdRoomType.id } },
            property: { connect: { id: createdRoomType.propertyId } },
          },
        });
      }

      await Promise.all(
        facilityIds.map((facilityId) =>
          tx.roomTypeFacility.create({
            data: {
              roomType: { connect: { id: createdRoomType.id } },
              facility: { connect: { id: facilityId } },
            },
          }),
        ),
      );
    });

    return createdRoomType;
  }
}
