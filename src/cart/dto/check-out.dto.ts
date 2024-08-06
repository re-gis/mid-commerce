/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class CheckoutDto {
  @IsString()
  firstname: string;

  @IsString()
  company_name: string;

  @IsString()
  street_address: string;

  @IsString()
  apartment: string;

  @IsString()
  town: string;

  @IsString()
  phone_number: string;

  @IsString()
  email: string;

  payment_method: any;
}
