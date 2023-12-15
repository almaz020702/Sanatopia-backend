import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserRoleType } from '../user/enums/user-role.enum';

@Injectable()
export class OwnerService {
  constructor(private prismaService: PrismaService) {}

  public async createOwner(tx: Prisma.TransactionClient, ownerId: number) {
    const role = await this.prismaService.role.findUnique({
      where: {
        name: UserRoleType.PROPERTY_OWNER,
      },
    });
    if (!role) {
      throw new BadRequestException('role does not exists');
    }

    return tx.userRoles.create({ data: { userId: ownerId, roleId: 2 } });
  }
}
