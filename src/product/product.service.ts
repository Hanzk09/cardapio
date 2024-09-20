import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Product } from './entities/product.entity';
import { FilterProducts } from './entities/filter-products.entity';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    try {
      const product: Product = await this.prismaService.product.create({
        data: {
          name: createProductDto.name,
          price: createProductDto.price,
          image: createProductDto.image,
          publishedAt: createProductDto.published ? new Date() : null,
          idUserCreated: userId,
          idUserEdited: userId,
        },
      });

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(filters: FilterProducts): Promise<any> {
    try {
      const quantidadeTotal = await this.prismaService.product.count({
        where: {
          name: {
            contains: filters.name,
          },
          price: {
            lte: filters.maxPrice ? filters.maxPrice : undefined,
            gte: filters.minPrice ? filters.minPrice : undefined,
          },
          publishedAt: {
            gte: filters.publishedAt ? filters.publishedAt : undefined,
          },
        },
      });

      const products: Product[] = await this.prismaService.product.findMany({
        where: {
          name: {
            contains: filters.name,
          },
          price: {
            lte: filters.maxPrice ? filters.maxPrice : undefined,
            gte: filters.minPrice ? filters.minPrice : undefined,
          },
          publishedAt: {
            gte: filters.publishedAt ? filters.publishedAt : undefined,
          },
        },
        take: filters.take ? filters.take : undefined,
        skip:
          filters.pagina && filters.take
            ? (filters.pagina - 1) * filters.take
            : undefined,
      });

      const quantidadePaginas: number = Math.ceil(
        quantidadeTotal / filters.take,
      );
      return {
        quantidadeTotal,
        quatidadePega: products.length,
        paginaAtual: filters.take ? filters.pagina : null,
        quantidadePaginas: quantidadePaginas < 1 ? 1 : quantidadePaginas,
        products,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product: Product = await this.prismaService.product.findUnique({
        where: { id: id },
      });

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    userId: number,
  ): Promise<Product> {
    try {
      const productExists: Product =
        await this.prismaService.product.findUnique({ where: { id: id } });
      if (!productExists) {
        throw new BadRequestException('Produto não encontrado');
      }

      const product: Product = await this.prismaService.product.update({
        where: {
          id: id,
        },
        data: {
          name: updateProductDto.name,
          price: updateProductDto.price,
          image: updateProductDto.image,
          publishedAt: updateProductDto.published
            ? productExists.publishedAt || new Date()
            : null,
          idUserEdited: userId,
        },
      });

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number): Promise<Product> {
    try {
      const productExists: Product =
        await this.prismaService.product.findUnique({ where: { id: id } });
      if (!productExists) {
        throw new BadRequestException('Produto não encontrado');
      }

      const product: Product = await this.prismaService.product.delete({
        where: {
          id: id,
        },
      });

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
