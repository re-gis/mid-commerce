/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith('Bearer')) {
      const token = authorization.split(' ')[1];

      if (!token)
        throw new UnauthorizedException(
          'You are not authorized to perform this action since you are not logged in.',
        );

      try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return true;
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException('Error while getting the token');
      }
    }
    throw new BadRequestException(
      'You are not authorized to perform this action pleases',
    );
  }
}
