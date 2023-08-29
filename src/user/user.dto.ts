import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserEntity } from './user.entity';

export interface PostUserResponse {
  user: Omit<UserEntity, 'password' | 'hashPassword'> & { token: string };
}

export class CreateUserDto {
  @IsNotEmpty() readonly username: string;
  @IsNotEmpty() @IsEmail() readonly email: string;
  @IsNotEmpty() readonly password: string;
}

export class LoginDto {
  @IsNotEmpty() @IsEmail() readonly email: string;
  @IsNotEmpty() password: string;
}

export class UpdateUserDto {
  readonly username: string;
  @IsEmail() readonly email: string;
  readonly image: string;
  readonly bio: string;
}
