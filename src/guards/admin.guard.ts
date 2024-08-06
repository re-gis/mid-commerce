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
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || !roles.includes('ADMIN')) {
      throw new UnauthorizedException(
        'please to access this route you must have ADMIN role',
      );
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    // role is not admin
    if (user.role !== 'ADMIN')
      throw new UnauthorizedException(
        'please to access this route you must have ADMIN role',
      );
    return user && user.role === 'ADMIN';
  }
}
