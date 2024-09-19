import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

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

      createUserDto.password = await bcrypt.hash(
        createUserDto.password,
        +process.env.SALTROUNDS,
      );

      var newUser = await this.prismaService.user.create({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          birthdate: true,
          createdAt: true,
          updatedAt: true,
        },
        data: createUserDto,
      });

      return newUser;
    } catch (error) {
      Logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      var users: User[] = await this.prismaService.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          birthdate: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return users;
    } catch (error) {
      Logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      var users: User = await this.prismaService.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          birthdate: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          id: id,
        },
      });
      return users;
    } catch (error) {
      Logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      var userExists = await this.prismaService.user.findUnique({
        where: { id: id },
      });

      if (!userExists) {
        throw new BadRequestException('Usuário não encontrado!');
      }

      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        +process.env.SALTROUNDS,
      );

      var users: User = await this.prismaService.user.update({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          birthdate: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          id: id,
        },
        data: updateUserDto,
      });
      return users;
    } catch (error) {
      Logger.error(error);
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
      Logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
