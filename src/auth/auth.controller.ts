/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { DefinedApiResponse } from 'src/payload/defined-payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() dto: LoginDto): Promise<DefinedApiResponse> {
    return new DefinedApiResponse(
      true,
      null,
      await this.authService.login(dto),
    );
  }
}
