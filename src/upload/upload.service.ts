import { Injectable, NotFoundException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
@Injectable()
export class UploadService {
  async uploadImage(
    key: string,
    files: Array<Express.Multer.File>,
  ): Promise<string[]> {
    const imageLocation: string[] = [];
    try {
      for await (const file of files) {
        const uuid = v4();
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
          Key: `${key}/${uuid}`,
        };
        await s3.putObject(params).promise();
        imageLocation.push(`${process.env.AWS_S3_BUCKET_URL}/${key}/${uuid}`);
      }
    } catch (e) {
      console.log(e);
    }

    return imageLocation;
  }

  async deleteImage(imageLocations: string[]): Promise<boolean> {
    try {
      for await (const location of imageLocations) {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: location.replace(`${process.env.AWS_S3_BUCKET_URL}/`, ''),
        };
        await s3.deleteObject(params).promise();
      }
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }
}
