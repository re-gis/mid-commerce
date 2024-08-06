/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';
import IResponse from 'src/enums/response.enum';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>
    
    getMyOrders = ():Promise<IResponse | undefined> => {

    }
}
