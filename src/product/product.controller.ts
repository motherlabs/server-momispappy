import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwt.guard';
import { bluedogBabyParsing } from 'src/utils/crawling/bluedog-baby';
import {
  CreateBrandDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('product')
@ApiTags('상품')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/category')
  @ApiOperation({ summary: '카테고리 리스트 API' })
  async findAllCategory() {
    return this.productService.findAllCategory();
  }

  @Post('/category')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '카테고리 등록 API' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          nullable: false,
        },
        image: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: { name: string },
  ) {
    const { name } = body;
    return this.productService.createCategory(name, image);
  }

  @Put('/category')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '카테고리 수정API' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          nullable: false,
        },
        name: {
          type: 'string',
          nullable: false,
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateCategory(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: { id: string; name: string },
  ) {
    const { id, name } = body;
    return this.productService.updateCategory(parseInt(id), name, image);
  }

  @Get('/brand')
  @ApiOperation({ summary: '브랜드 리스트 API' })
  async findAllBrand() {
    return this.productService.findAllBrand();
  }

  @Post('/brand')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '브랜드 등록 API' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createBrand(
    @UploadedFile() image: Express.Multer.File,
    @Body() createBrand: CreateBrandDto,
  ) {
    return this.productService.createBrand(createBrand.name, image);
  }

  @Put('/brand')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '브랜드 수정API' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          nullable: false,
        },
        name: {
          type: 'string',
          nullable: false,
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateBrand(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: { id: string; name: string },
  ) {
    const { id, name } = body;
    return this.productService.updateBrand(parseInt(id), name, image);
  }

  @Post('/crawling')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '상품 크롤리 조회 API' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pageLocation: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
      },
    },
  })
  async crawling(@Body() body: { pageLocation: string; name: string }) {
    const { pageLocation, name } = body;
    console.log('crawling Location: ', pageLocation);
    if (name === '블루독베이비') {
      return await bluedogBabyParsing(pageLocation);
    } else {
      throw new NotFoundException();
    }
  }

  @Post('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '상품 등록 API' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async createProduct(
    @Body() createProduct: CreateProductDto,
    @UploadedFiles() image: Array<Express.Multer.File>,
  ) {
    return this.productService.createProduct(createProduct, image);
  }

  @Get('/')
  @ApiOperation({ summary: '상품 정보 리스트 API' })
  async findAllProduct() {
    return this.productService.findAllProduct();
  }

  @Get('/:id')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '상품 정보 API' })
  @ApiParam({ name: 'id', required: true })
  async findOneProduct(@Param('id') id: string) {
    return this.productService.findOneProduct(id);
  }

  @Delete('/:id')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '상품 삭제 API' })
  @ApiParam({ name: 'id', required: true })
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Put('/:id')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '상품 수정 API' })
  @ApiParam({
    name: 'id',
    required: true,
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProduct: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProduct);
  }
}
