import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { Relation } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RelationType {
  @ApiProperty()
  toProductId: number;
  @ApiProperty()
  fromProductId: number;
}

export class DeleteImageType {
  @ApiProperty()
  id: number;
  @ApiProperty()
  location: string;
}

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

  @ApiProperty({
    required: true,
    example: 'ex)true',
  })
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

export class UpdateProductDto {
  @ApiProperty({ required: true })
  @IsNumber()
  readonly categoryId: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly discount: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly shippingFee: number;

  @ApiProperty({
    required: true,
  })
  @IsBoolean()
  readonly isEvent: boolean;

  @ApiProperty({ required: false, type: [DeleteImageType] })
  @IsOptional()
  readonly deleteImages: DeleteImageType[];

  @ApiProperty({ required: false, type: [RelationType] })
  @IsOptional()
  readonly oldRelations: Relation[];

  @ApiProperty({ required: false, type: [RelationType] })
  @IsOptional()
  readonly recentRelations: Relation[];
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
