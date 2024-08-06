/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import IResponse from 'src/enums/response.enum';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  login = async (dto: LoginDto): Promise<IResponse | undefined> => {
    try {
      if (!dto.email || !dto.password)
        throw new BadRequestException('Login details must be provided!');
      const u: User = await this.userRepository.findOne({
        where: {
          email: dto.email,
        },
      });

      if (!u) throw new BadRequestException('Invalid email or password!');

      const isPasswordValid = await compare(dto.password, u.password);
      if (!isPasswordValid)
        throw new BadRequestException('Invalid email or password!');

      const payload = {
        email: u.email,
        role: u.role,
        username: u.username,
      };
      const token: string = sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24d',
      });

      return {
        data: token,
        status: 200,
      };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  };
}
