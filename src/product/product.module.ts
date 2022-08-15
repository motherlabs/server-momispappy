import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UploadService } from 'src/upload/upload.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ProductService, UploadService, PrismaService],
  controllers: [ProductController],
})
export class ProductModule {}
