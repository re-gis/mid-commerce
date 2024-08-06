/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import IResponse from 'src/enums/response.enum';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  @InjectRepository(Order)
  private readonly orderRepository: Repository<Order>;

  @InjectRepository(OrderItem)
  private readonly orderItemRepository: Repository<OrderItem>;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  getMyOrders = async (u: any): Promise<IResponse | undefined> => {
    try {
      const user: User = await this.userRepository.findOne({
        where: { email: u.email },
        relations: ['orders', 'orders.items'],
      });

      if (!user.orders || user.orders.length === 0) {
        return {
          status: 200,
          message: user.orders,
        };
      }

      return {
        status: 200,
        message: user.orders,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };
}
