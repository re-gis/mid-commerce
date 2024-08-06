/* eslint-disable prettier/prettier */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/entities/user.entity';

@Injectable()
export class SellerGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || !roles.includes('SELLER')) {
      throw new UnauthorizedException(
        'please to access this route you must have SELLER role',
      );
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    // role is not seller
    if (user.role !== 'SELLER')
      throw new UnauthorizedException(
        'please to access this route you must have SELLER role',
      );
    return user && user.role === 'SELLER';
  }
}
