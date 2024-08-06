/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { GetUser } from 'src/decorators';
import { DefinedApiResponse } from 'src/payload/defined-payload';
import { CartService } from './cart.service';
import { CheckoutDto } from './dto/check-out.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  async addToCart(
    @Body() dto: AddToCartDto,
    @GetUser() user: any,
  ): Promise<DefinedApiResponse> {
    return new DefinedApiResponse(
      true,
      null,
      await this.cartService.addToCart(dto, user),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/mine')
  async getCart(@GetUser() user: any): Promise<DefinedApiResponse> {
    return new DefinedApiResponse(
      true,
      null,
      await this.cartService.getCart(user),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/checkout')
  async checkout(@Body() dto: CheckoutDto, @GetUser() user: any) {
    return new DefinedApiResponse(
      true,
      null,
      await this.cartService.checkout(user, dto),
    );
  }
}
