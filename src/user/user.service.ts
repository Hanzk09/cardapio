import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      var userExists = await this.prismaService.user.findFirst({
        where: {
          email: createUserDto.email,
        },
      });

      if (userExists) {
        throw new BadRequestException('Usuário já cadastrado!');
      }

      var newUser = await this.prismaService.user.create({
        data: createUserDto,
      });

      return newUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      var users: User[] = await this.prismaService.user.findMany();
      return users;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      var users: User = await this.prismaService.user.findUnique({
        where: {
          id: id,
        },
      });
      return users;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      var users: User = await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: updateUserDto,
      });
      return users;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number): Promise<User> {
    try {
      var users: User = await this.prismaService.user.delete({
        where: {
          id: id,
        },
      });
      return users;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
