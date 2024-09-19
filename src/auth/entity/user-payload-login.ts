import { IsEmail, IsString } from 'class-validator';

export class UserPayloadLogin {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
