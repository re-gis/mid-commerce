/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

export const IsAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): boolean => {
    console.log(`User role: `);
    const request = ctx.switchToHttp().getRequest();
    console.log(request);
    const user: User = request.user;

    if (user && user.role == 'ADMIN') {
      return true;
    } else {
      return false;
    }
  },
);
