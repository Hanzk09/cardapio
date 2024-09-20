import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterProducts {
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  publishedAt: Date;
  @IsString()
  @IsOptional()
  name: string;
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  maxPrice: number;
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  minPrice: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  take: number;
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  pagina: number;
}
