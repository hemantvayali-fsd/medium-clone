import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign as signJwt } from 'jsonwebtoken';

import {
  CreateUserDto,
  LoginDto,
  PostUserResponse,
  UpdateUserDto,
} from './user.dto';
import { UserEntity } from './user.entity';
import { JWT_SECRET } from '../config';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async createUser(payload: CreateUserDto): Promise<UserEntity> {
    const userByEmailOrUsername = await this.findUserByEmailOrUsername(
      payload.email,
      payload.username,
    );
    if (userByEmailOrUsername) {
      throw new HttpException(
        'Email or username is taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = Object.assign(new UserEntity(), payload);
    return this.userRepo.save(newUser);
  }

  async login(payload: LoginDto): Promise<PostUserResponse> {
    const user = await this.userRepo.findOne({
      where: { email: payload.email },
      select: ['id', 'email', 'username', 'bio', 'image', 'password'],
    });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    const matchPassword = await compare(payload.password, user.password);
    if (!matchPassword)
      throw new HttpException(
        'Password is wrong!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    return this.buildUserResponse(user);
  }

  async updateUser(
    userId: number,
    payload: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    if (!user) throw new HttpException('Invalid user', HttpStatus.BAD_REQUEST);

    Object.assign(user, payload);
    return this.userRepo.save(user);
  }

  /**
   * returns user object with only required properties
   * @param user
   * @returns
   */
  buildUserResponse(user: UserEntity): PostUserResponse {
    const response = {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
    delete response.user['password'];
    delete response.user['hashPassword'];
    return response;
  }

  /**
   * Finds a user in db by provide user id and returns the user if found.
   * @param id - user id
   * @returns user
   */
  findUserById = async (id: number): Promise<UserEntity> => {
    return this.userRepo.findOne({ where: { id } });
  };

  /**
   * Finds a user in db by provided email or username
   * @param email
   * @param username
   * @returns
   */
  private findUserByEmailOrUsername = async (
    email?: string,
    username?: string,
  ): Promise<UserEntity | null> => {
    const where = [];
    if (email) where.push({ email });
    if (username) where.push({ username });

    return this.userRepo.findOne({ where });
  };

  private generateJwt(user: UserEntity): string {
    return signJwt(
      {
        id: user.id,
        user: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }
}
