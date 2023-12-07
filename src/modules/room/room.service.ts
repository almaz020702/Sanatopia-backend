/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateRoomResponse } from './interfaces/create-room-response.interface';
import { CreateRoomBodyDto } from './dto/create-room-body.dto';

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}

  public async createHotelRooms(rooms: CreateRoomBodyDto[]): Promise<Room[]> {
    return this.prismaService.$transaction(async (tx): Promise<Room[]> => {
      const createdRooms = await Promise.all(
        rooms.map(({ facilities, ...roomDetails }) =>
          tx.room.create({
            data: { ...roomDetails, surfaceArea: roomDetails.surfaceArea },
          }),
        ),
      );

      const facilitiesData = rooms.flatMap((room, index) =>
        room.facilities.map((facilityId) => ({
          roomId: createdRooms[index].id,
          facilityId,
        })),
      );

      await tx.roomFacility.createMany({
        data: facilitiesData,
      });

      return createdRooms;
    });
  }

  // below methods for the future use
  public async createRoom(
    roomData: CreateRoomBodyDto,
  ): Promise<CreateRoomResponse> {
    const { facilities, ...roomDetails } = roomData;
    return this.prismaService.$transaction(
      async (tx): Promise<CreateRoomResponse> => {
        const room = await tx.room.create({
          data: { ...roomDetails, surfaceArea: roomDetails.surfaceArea },
        });
        await this.createRoomFacilities(facilities, room.id, tx);
        return {
          message: 'You have created a room',
          roomId: room.id,
        };
      },
    );
  }

  private async createRoomFacilities(
    facilitiesIds: number[],
    roomId: number,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const roomFacilities = facilitiesIds.map((id) => ({
      facilityId: id,
      roomId,
    }));
    tx.roomFacility.createMany({
      data: roomFacilities,
    });
  }

  public async getAllRooms(): Promise<Room[]> {
    return this.prismaService.room.findMany();
  }
}
