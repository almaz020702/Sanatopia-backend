/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './interfaces/room.interface';

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

  async createRoomTypes(createRoomTypesDto: CreateRoomTypeDto[]) {
    return Promise.all(
      createRoomTypesDto.map((createRoomTypeDto) =>
        this.createRoomType(createRoomTypeDto),
      ),
    );
  }

  async addRoom(
    roomData: CreateRoomDto,
    ownerId: number,
    propertyId: number,
  ): Promise<Room> {
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

    const createdRoom = await this.prismaService.room.create({
      data: {
        ...roomData,
        propertyId,
      },
    });

    return createdRoom;
  }

  async getRoomDetails(
    propertyId: number,
    roomId: number,
    ownerId: number,
  ): Promise<Room | null> {
    const room = await this.prismaService.room.findUnique({
      where: { id: roomId },
      include: { property: true, roomType: true },
    });

    if (!room || room.propertyId !== propertyId) {
      throw new NotFoundException('Room not found');
    }

    if (room.property.ownerId !== ownerId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this property',
      );
    }

    return room;
  }
}
