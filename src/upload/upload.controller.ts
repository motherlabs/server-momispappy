import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('이미지 업로드')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('/test')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // name: { type: 'string', nullable: false },
        // age: { type: 'string', nullable: false },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOperation({ summary: '이미지 업로드 테스트 API' })
  @UseInterceptors(FilesInterceptor('files', 5))
  async upload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    // @Body() body: { name: string; age: string },
  ) {
    return this.uploadService.uploadImage('product', files);
  }

  @Delete('/test')
  @ApiOperation({ summary: '이미지 삭제 테스트 API' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        location: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  })
  async delete(@Body() body: { location: string[] }) {
    return this.uploadService.deleteImage(body.location);
  }
}
