/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetUser, Roles } from 'src/decorators';
import { JwtAuthGuard } from 'src/guards';
import { DefinedApiResponse } from 'src/payload/defined-payload';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SellerGuard } from 'src/guards/seller.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @UseGuards(JwtAuthGuard, SellerGuard)
  @Roles('SELLER')
  async createProduct(
    @UploadedFiles() file: { image?: Express.Multer.File[] },
    @Body() dto: CreateProductDto,
    @GetUser() user: any,
  ): Promise<DefinedApiResponse> {
    const image = file.image ? file.image[0] : undefined;
    return new DefinedApiResponse(
      true,
      null,
      await this.productService.createProduct(dto, image, user),
    );
  }

  @Get('/')
  async getALlProducts(): Promise<DefinedApiResponse> {
    return new DefinedApiResponse(
      true,
      null,
      await this.productService.getAllProducts(),
    );
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string): Promise<DefinedApiResponse> {
    return new DefinedApiResponse(
      true,
      null,
      await this.productService.getProductById(+id),
    );
  }
  @Delete('/:id')
  async deleteProductById(
    @Param('id') id: string,
  ): Promise<DefinedApiResponse> {
    return new DefinedApiResponse(
      true,
      null,
      await this.productService.deleteProductById(+id),
    );
  }
}
