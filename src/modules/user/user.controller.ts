/* eslint-disable @typescript-eslint/indent */
// eslint-disable-next-line object-curly-newline
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserService } from './user.service';
import { UserProfileInfo } from './interfaces/user-profile-info.interface';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('User Profile Management')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get User Profile' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Get('/profile')
  async getUserProfileInfo(@UserId() userId: number): Promise<UserProfileInfo> {
    return this.userService.getUserProfileInfo(userId);
  }

  @ApiOperation({ summary: 'Update User Profile Information' })
  @ApiBody({ type: UpdateUserProfileDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Patch('/profile')
  async updateUserProfile(
    @UserId() userId: number,
    @Body() newUserData: UpdateUserProfileDto,
  ): Promise<UserProfileInfo> {
    return this.userService.updateUserProfile(userId, newUserData);
  }

  @ApiOperation({ summary: 'Update User Password' })
  @ApiBody({ type: UpdatePasswordDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Patch('/profile/password')
  async updatePassword(
    @UserId() userId: number,
    @Body() passwordData: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.updatePassword(userId, passwordData);
  }

  @ApiOperation({ summary: 'Delete User Profile' })
  @ApiBody({})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Delete('/profile')
  async deleteUser(@UserId() userId: number): Promise<{ message: string }> {
    return this.userService.deleteUser(userId);
  }
}
