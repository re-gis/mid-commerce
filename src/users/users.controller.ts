/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { DefinedApiResponse } from 'src/payload/defined-payload';
import { AdminGuard, JwtAuthGuard } from 'src/guards';
import { GetUser, Roles } from 'src/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<DefinedApiResponse> {
    return new DefinedApiResponse(
      true,
      null,
      await this.userService.register(dto),
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles('ADMIN')
  @Get('/all')
  async getAllUsers(): Promise<DefinedApiResponse> {
    return new DefinedApiResponse(
      true,
      null,
      await this.userService.getAllUsers(),
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles('ADMIN')
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<DefinedApiResponse> {
    return new DefinedApiResponse(
      true,
      null,
      await this.userService.getUserById(+id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@GetUser() user: any): Promise<DefinedApiResponse> {
    return new DefinedApiResponse(
      true,
      null,
      await this.userService.getMe(user),
    );
  }
}
