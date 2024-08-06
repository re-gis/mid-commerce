/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import IResponse from 'src/enums/response.enum';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Cart } from 'src/entities/cart.entity';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectRepository(Cart)
  private readonly cartRepository: Repository<Cart>;

  register = async (dto: RegisterDto): Promise<IResponse | undefined> => {
    try {
      if (!dto.email || !dto.password || !dto.username)
        throw new BadRequestException('All credentials are required.');
      const eUser: User = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (eUser)
        throw new BadRequestException(`User ${dto.email} already exists.`);
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const r = !dto.role ? Role.CLIENT : dto.role;

      const newUser = this.userRepository.create({
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      });

      const cart: Cart = new Cart();
      cart.owner = newUser;

      newUser.cart = cart;
      newUser.role = r;
      await this.userRepository.save(newUser);
      await this.cartRepository.save(cart);
      return {
        status: 201,
        message: 'Successfully registered.',
      };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  };

  getAllUsers = async (): Promise<IResponse | undefined> => {
    try {
      const users = await this.userRepository.find();
      users.forEach((u) => {
        delete u.password;
      });
      return { status: 200, message: users };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  getUserById = async (id: number): Promise<IResponse | undefined> => {
    try {
      const u: User = await this.userRepository.findOne({ where: { id } });
      delete u.password;
      return {
        status: 200,
        message: u,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  getMe = async (user: any): Promise<IResponse | undefined> => {
    try {
      const u: User = await this.userRepository.findOne({
        where: { email: user.email },
      });
      delete u.password;
      return {
        status: 200,
        message: u,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };
}
