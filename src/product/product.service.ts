/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import IResponse from 'src/enums/response.enum';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from 'src/entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @InjectRepository(Product)
  private readonly productRepository: Repository<Product>;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  createProduct = async (
    dto: CreateProductDto,
    imagepath: Express.Multer.File,
    user: any,
  ): Promise<IResponse | undefined> => {
    try {
      if (
        !dto.description ||
        !dto.name ||
        !dto.price ||
        !dto.quantity ||
        !imagepath
      )
        throw new BadRequestException('All product details are required.');
      const u: User = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (u.role != 'SELLER')
        throw new ForbiddenException(
          'You are not allowed to perform this action.',
        );

      const image = await this.cloudinaryService.uploadImage(imagepath);

      if (!image) {
        throw new InternalServerErrorException(
          'Error while uploading image or video!',
        );
      }
      const p: Product = this.productRepository.create(dto);
      p.image = image.url;
      p.owner = u;
      return {
        status: 201,
        message: await this.productRepository.save(p),
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  getAllProducts = async (): Promise<IResponse | undefined> => {
    try {
      return { status: 200, message: await this.productRepository.find() };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  getProductById = async (id: number): Promise<IResponse | undefined> => {
    try {
      return {
        status: 200,
        message: await this.productRepository.findOne({ where: { id } }),
      };
    } catch (e) {}
  };
}
