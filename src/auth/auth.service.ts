import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserPayloadLogin } from './entity/user-payload-login';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from './entity/login-payload';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: User): Promise<LoginPayload> {
    try {
      const { id, name, email } = user;

      return {
        id,
        name,
        email,
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
    if (user && user.password == payload.password) {
      return user;
    }
    return null;
  }
}
