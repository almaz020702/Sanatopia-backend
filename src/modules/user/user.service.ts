import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User } from './interfaces/user.interface';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfileInfo } from './interfaces/user-profile-info.interface';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private emailVerificationService: EmailVerificationService,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const userRoles = await this.prismaService.userRoles.findMany({
      where: { userId },
      include: { role: true },
    });

    if (!userRoles || userRoles.length === 0) {
      throw new NotFoundException('User roles not found');
    }

    const roleNames = userRoles.map((userRole) => userRole.role.name);

    return roleNames;
  }

  async getUserProfileInfo(userId: number): Promise<UserProfileInfo> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        isActivated: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User was not found');
    }

    return user;
  }

  async updateUserProfile(
    userId: number,
    newUserData: UpdateUserProfileDto,
  ): Promise<UserProfileInfo> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User was not found');
    }

    if (newUserData.email) {
      const emailCheck = await this.findUserByEmail(newUserData.email);
      if (emailCheck) {
        throw new BadRequestException('User with this email already exists');
      }

      // eslint-disable-next-line operator-linebreak
      const activationToken =
        await this.emailVerificationService.generateActivationToken(
          newUserData.email,
        );
      await this.emailVerificationService.sendVerificationEmail(
        newUserData.email,
        activationToken,
      );

      // eslint-disable-next-line no-param-reassign
      newUserData.isActivated = false;
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: { ...user, ...newUserData },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        isActivated: true,
      },
    });

    return updatedUser;
  }

  async updatePassword(
    userId: number,
    passwordData: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User was not found');
    }

    const comparePassword = bcrypt.compareSync(
      passwordData.oldPassword,
      user.password,
    );
    if (!comparePassword) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(passwordData.newPassword, 5);

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password was successfully updated' };
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    await this.prismaService.user.delete({
      where: { id: userId },
    });
    return { message: 'User was successfully deleted' };
  }

  async addToFavorites(userId: number, propertyId: number) {
    const favorite = this.prismaService.favorite.create({
      data: { userId, propertyId },
    });

    return favorite;
  }

  async getFavoriteProperties(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { Favorite: { include: { property: true } } },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.Favorite.map((favorite) => favorite.property);
  }

  async deleteFromFavorites(userId: number, propertyId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { Favorite: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const favorite = user.Favorite.find((fav) => fav.propertyId === propertyId);
    if (!favorite) {
      throw new NotFoundException('Favorite property not found for the user');
    }

    await this.prismaService.favorite.delete({
      where: { id: favorite.id },
    });

    return { message: 'Favorite property deleted successfully' };
  }
}
