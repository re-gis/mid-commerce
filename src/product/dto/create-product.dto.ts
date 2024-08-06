/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly price: number;

  @IsNumber()
  readonly quantity: number;
}