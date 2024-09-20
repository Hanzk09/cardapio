import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;
  @IsNumber()
  price: number;
  @IsString()
  image: string;
  @IsBoolean()
  @IsOptional()
  published: boolean;
}
