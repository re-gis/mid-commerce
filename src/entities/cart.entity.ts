/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { User } from './user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[];

  @OneToOne(() => User, (user) => user.cart)
  owner: User;
}
