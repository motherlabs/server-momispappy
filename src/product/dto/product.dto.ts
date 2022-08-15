import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly categoryId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly brandId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly crawlingLocation: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly price: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly isEvent: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly shippingFee: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly discount: string;

  @ApiProperty({
    items: { type: 'string', format: 'binary' },
    type: 'array',
    required: true,
  })
  readonly mainImage;

  @ApiProperty({
    items: { type: 'string', format: 'binary' },
    type: 'array',
    required: true,
  })
  readonly descriptionImage;

  @ApiProperty({
    type: [String],
    required: false,
  })
  readonly relations: string;
}

export class CreateBrandDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  readonly image;
}
