/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import IResponse from 'src/enums/response.enum';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from 'src/entities/cart-item.entity';
import { User } from 'src/entities/user.entity';
import { CheckoutDto } from './dto/check-out.dto';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class CartService {
  @InjectRepository(Cart)
  private readonly cartRepository: Repository<Cart>;

  @InjectRepository(CartItem)
  private readonly cartItemRepository: Repository<CartItem>;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectRepository(Product)
  private readonly productRepository: Repository<Product>;

  addToCart = async (
    dto: AddToCartDto,
    user: any,
  ): Promise<IResponse | undefined> => {
    try {
      const u = await this.userRepository.findOne({
        where: { email: user.email },
        relations: ['cart'],
      });
      if (!u) {
        throw new NotFoundException('User not found');
      }

      let cart = u.cart;

      if (!cart) {
        cart = this.cartRepository.create({ owner: u, items: [] });
        await this.cartRepository.save(cart);
      }

      let cartItem = await this.cartItemRepository.findOne({
        where: { cart: { id: cart.id }, productId: dto.productId },
      });

      if (cartItem) {
        cartItem.quantity += dto.quantity;
      } else {
        cartItem = this.cartItemRepository.create({
          productId: dto.productId,
          quantity: dto.quantity,
          cart: cart,
        });
      }

      await this.cartItemRepository.save(cartItem);
      return {
        status: 201,
        message: 'Product added to cart successfully',
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  getCart = async (user: any): Promise<IResponse | undefined> => {
    try {
      const u: User = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (!u || !u.cart) {
        throw new NotFoundException('Cart not found');
      }

      const cart = await this.cartRepository.findOne({
        where: { id: u.cart.id },
        relations: ['items'],
      });

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      return {
        status: 200,
        message: cart,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  removeItemFromCart = async (
    itemId: number,
    u: any,
  ): Promise<IResponse | undefined> => {
    try {
      const user = await this.userRepository.findOne({
        where: { email: u.email },
        relations: ['cart', 'cart.items'],
      });
      if (!user || !user.cart) {
        throw new NotFoundException('Cart not found');
      }

      const item = await this.cartItemRepository.findOne({
        where: { id: itemId, cart: { id: user.cart.id } },
      });
      if (!item) {
        throw new NotFoundException('Item not found in cart');
      }

      await this.cartItemRepository.remove(item);

      return { status: 200, message: 'Item removed from cart' };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  updateItemQuantity = async (
    u: any,
    itemId: number,
    quantity: number,
  ): Promise<IResponse | undefined> => {
    try {
      const user = await this.userRepository.findOne({
        where: { email: u.email },
        relations: ['cart', 'cart.items'],
      });
      if (!user || !user.cart) {
        throw new NotFoundException('Cart not found');
      }

      const item = await this.cartItemRepository.findOne({
        where: { id: itemId, cart: { id: user.cart.id } },
      });
      if (!item) {
        throw new NotFoundException('Item not found in cart');
      }

      if (quantity <= 0) {
        await this.cartItemRepository.remove(item);
        return {
          status: 200,
          message: 'Item removed from cart due to zero quantity',
        };
      }

      item.quantity = quantity;
      await this.cartItemRepository.save(item);

      return { status: 200, message: 'Item quantity updated' };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  clearCart = async (u: any): Promise<IResponse | undefined> => {
    try {
      const user = await this.userRepository.findOne({
        where: { email: u.email },
        relations: ['cart', 'cart.items'],
      });
      if (!user || !user.cart) {
        throw new NotFoundException('Cart not found');
      }

      await this.cartItemRepository.remove(user.cart.items);

      return { status: 200, message: 'Cart cleared' };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  checkout = async (
    u: any,
    dto: CheckoutDto,
  ): Promise<IResponse | undefined> => {
    try {
      console.log({ u, dto });
      return { status: 200, message: 'Not yet implemented' };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  getCartTotal = async (u: any): Promise<IResponse | undefined> => {
    try {
      const user = await this.userRepository.findOne({
        where: { email: u.email },
        relations: ['cart', 'cart.items'],
      });
      if (!user || !user.cart) {
        throw new NotFoundException('Cart not found');
      }

      let total = 0;

      for (const item of user.cart.items) {
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
        });
        if (product) {
          total += item.quantity * product.price;
        }
      }

      return { status: 200, message: { total } };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };
}
