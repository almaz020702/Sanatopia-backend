import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class PhotoService {
  constructor(private readonly prismaService: PrismaService) {}

  async uploadPhoto(propertyId: number, file: Express.Multer.File) {
    const property = await this.prismaService.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const uploadDirectory = './uploads';

    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }
    const imageFolderPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uploads',
    );
    const fileName = `${uuidv4()}.jpg`;
    const filePath = path.join(imageFolderPath, fileName);

    try {
      fs.writeFileSync(filePath, file.buffer);
    } catch (error) {
      console.error('Error saving the image:', error);
      throw new InternalServerErrorException('Image could not be saved');
    }

    const createdPhoto = await this.prismaService.photo.create({
      data: {
        url: `uploads/${fileName}`,
      },
    });

    await this.prismaService.propertyPhoto.create({
      data: {
        property: { connect: { id: propertyId } },
        photo: { connect: { id: createdPhoto.id } },
      },
    });

    return {
      photoId: createdPhoto.id,
      propertyId,
      message: 'Photo uploaded successfully',
    };
  }

  async uploadRoomTypePhotos(roomTypeId: number, file: Express.Multer.File) {
    const roomType = await this.prismaService.roomType.findUnique({
      where: { id: roomTypeId },
    });

    if (!roomType) {
      throw new NotFoundException('Room Type not found');
    }

    const uploadDirectory = './uploads';

    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }
    const imageFolderPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uploads',
    );
    const fileName = `${uuidv4()}.jpg`;
    const filePath = path.join(imageFolderPath, fileName);

    try {
      fs.writeFileSync(filePath, file.buffer);
    } catch (error) {
      console.error('Error saving the image:', error);
      throw new InternalServerErrorException('Image could not be saved');
    }

    const createdPhoto = await this.prismaService.photo.create({
      data: {
        url: `uploads/${fileName}`,
      },
    });

    await this.prismaService.roomTypePhoto.create({
      data: {
        roomType: { connect: { id: roomTypeId } },
        photo: { connect: { id: createdPhoto.id } },
      },
    });

    return {
      photoId: createdPhoto.id,
      roomTypeId,
      message: 'Photo uploaded successfully',
    };
  }

  async getPhotoById(photoId: number): Promise<Buffer> {
    const photoName = await this.prismaService.photo.findUnique({
      where: { id: photoId },
    });

    if (!photoName) {
      throw new NotFoundException('Photo was not found');
    }

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      photoName.url,
    );

    try {
      const photoData = fs.readFileSync(filePath);
      return photoData;
    } catch (error) {
      throw new NotFoundException('Photo not found');
    }
  }

  async deletePhoto(photoId: number) {
    const photo = await this.prismaService.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    const filePath = path.join(__dirname, '..', '..', '..', '..', photo.url);

    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete photo file');
    }

    await this.prismaService.photo.delete({
      where: { id: photoId },
    });

    return { message: 'Photo deleted successfully' };
  }
}
