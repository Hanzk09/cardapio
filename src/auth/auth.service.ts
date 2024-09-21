import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserPayloadLogin } from './entity/user-payload-login';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from './entity/login-payload';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: User): Promise<LoginPayload> {
    try {
      const { id, name, email, phone, birthdate } = user;

      return {
        id,
        name,
        email,
        phone,
        birthdate,
        token: await this.jwtService.signAsync({ id, name, email }),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async validateUser(payload: UserPayloadLogin): Promise<User> {
    const user = await this.userService.findByEmail(payload.email);
    if (user && (await bcrypt.compare(payload.password, user.password))) {
      return user;
    }
    return null;
  }
}
