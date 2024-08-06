/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<cloudinary.UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        })
        .end(file.buffer);
    });
  }
}
