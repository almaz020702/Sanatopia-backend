/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/indent */
import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { PhotoService } from './photo.service';

@ApiTags('Photo')
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @ApiOperation({ summary: 'Upload photo for property' })
  @ApiProperty({ type: 'file' })
  @Post('/:propertyId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('propertyId') propertyId: number,
  ) {
    return this.photoService.uploadPhoto(propertyId, file);
  }

  @ApiOperation({ summary: 'Upload photo for room type' })
  @ApiProperty({ type: 'file' })
  @Post('/room-type/:roomTypeId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRoomTypePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('roomTypeId') roomTypeId: number,
  ) {
    return this.photoService.uploadRoomTypePhotos(roomTypeId, file);
  }

  @ApiOperation({ summary: 'Get photo by ID' })
  @Get('/:photoId')
  async getPhotoById(@Param('photoId') photoId: number, @Res() res: Response) {
    const photoData = await this.photoService.getPhotoById(photoId);

    if (!photoData) {
      return res.status(404).send('Photo not found');
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(photoData);
  }
}
