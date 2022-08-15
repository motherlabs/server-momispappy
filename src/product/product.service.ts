import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductImageType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    private uploadService: UploadService,
    private prismaService: PrismaService,
  ) {}

  async findAllCategory() {
    return await this.prismaService.category.findMany();
  }

  async createCategory(name: string, image: Express.Multer.File) {
    try {
      const files: Express.Multer.File[] = [];
      files.push(image);
      const imageLocation = await this.uploadService.uploadImage(
        'category',
        files,
      );
      return await this.prismaService.category.create({
        data: {
          name: name,
          imageLocation: imageLocation[0],
        },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async updateCategory(id: number, name: string, image: Express.Multer.File) {
    try {
      if (image) {
        const files: Express.Multer.File[] = [];
        files.push(image);

        const existCategory = await this.prismaService.category.findUnique({
          where: { id },
        });
        await this.uploadService.deleteImage([existCategory.imageLocation]);
        const imageLocation = await this.uploadService.uploadImage(
          'category',
          files,
        );
        return await this.prismaService.category.update({
          where: { id },
          data: { name, imageLocation: imageLocation[0] },
        });
      } else {
        return await this.prismaService.category.update({
          where: { id },
          data: { name },
        });
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async findAllBrand() {
    return await this.prismaService.brand.findMany();
  }

  async createBrand(name: string, image: Express.Multer.File) {
    try {
      const files: Express.Multer.File[] = [];
      files.push(image);
      const imageLocation = await this.uploadService.uploadImage(
        'brand',
        files,
      );
      return await this.prismaService.brand.create({
        data: {
          name: name,
          imageLocation: imageLocation[0],
        },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async updateBrand(id: number, name: string, image: Express.Multer.File) {
    try {
      if (image) {
        const files: Express.Multer.File[] = [];
        files.push(image);

        const existBrand = await this.prismaService.brand.findUnique({
          where: { id },
        });
        await this.uploadService.deleteImage([existBrand.imageLocation]);
        const imageLocation = await this.uploadService.uploadImage(
          'brand',
          files,
        );
        return await this.prismaService.brand.update({
          where: { id },
          data: { name, imageLocation: imageLocation[0] },
        });
      } else {
        return await this.prismaService.brand.update({
          where: { id },
          data: { name },
        });
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async createProduct(
    createProduct: CreateProductDto,
    image: Array<Express.Multer.File>,
  ) {
    const categoryId = parseInt(createProduct.categoryId);
    const brandId = parseInt(createProduct.brandId);
    const crawlingLocation = createProduct.crawlingLocation;
    const isEvent = createProduct.isEvent === 'true' ? true : false;
    const name = createProduct.name;
    const price = parseInt(createProduct.price);
    const shippingFee = parseInt(createProduct.shippingFee);
    const discount = parseInt(createProduct.discount);
    const mainImage = image.filter((v) => v.fieldname === 'mainImage');
    const descriptionImage = image.filter(
      (v) => v.fieldname === 'descriptionImage',
    );

    const product = await this.prismaService.product.create({
      data: {
        categoryId,
        brandId,
        crawlingLocation,
        isEvent,
        name,
        price,
        shippingFee,
        discount,
      },
    });
    if (product) {
      const mainImageList: {
        productId: number;
        type: ProductImageType;
        location: string;
      }[] = [];
      const descriptionImageList: {
        productId: number;
        type: ProductImageType;
        location: string;
      }[] = [];
      const mainImageLocation = await this.uploadService.uploadImage(
        'product',
        mainImage,
      );
      const descriptionImageLocation = await this.uploadService.uploadImage(
        'product',
        descriptionImage,
      );
      mainImageLocation.map((v) => {
        mainImageList.push({
          productId: product.id,
          type: 'MAIN',
          location: v,
        });
      });
      descriptionImageLocation.map((v) => {
        descriptionImageList.push({
          productId: product.id,
          type: 'DESCRIPTION',
          location: v,
        });
      });

      await this.prismaService.$transaction([
        this.prismaService.productImage.createMany({ data: mainImageList }),
        this.prismaService.productImage.createMany({
          data: descriptionImageList,
        }),
      ]);

      return {
        product: product,
        mainImageLocation: mainImageLocation,
        descriptionImageLocation: descriptionImageLocation,
      };
    }
  }
}
