import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRole({ name }: CreateRoleDto) {
    const role = await this.prismaService.role.findUnique({ where: { name } });
    if (role) {
      throw new BadRequestException(`Role: ${role.name} already exists`);
    }
    await this.prismaService.role.create({
      data: { name },
    });
  }
}
