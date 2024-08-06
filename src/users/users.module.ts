/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Cart } from 'src/entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
