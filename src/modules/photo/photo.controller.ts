/* eslint-disable @typescript-eslint/indent */
import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('/:propertyId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('propertyId') propertyId: number,
  ) {
    return this.photoService.uploadPhoto(propertyId, file);
  }

  @Post('/room-type/:propertyId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRoomTypePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('propertyId') roomTypeId: number,
  ) {
    return this.photoService.uploadRoomTypePhotos(roomTypeId, file);
  }
}
