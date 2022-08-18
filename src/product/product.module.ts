import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UploadService } from 'src/upload/upload.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [ProductService, UploadService, PrismaService],
  imports: [HttpModule],
  controllers: [ProductController],
})
export class ProductModule {}
