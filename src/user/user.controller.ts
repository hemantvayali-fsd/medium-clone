import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto, UpdateUserDto } from './user.dto';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto) {
    try {
      const response = await this.userService.createUser(createUserDto);
      return this.userService.buildUserResponse(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity) {
    return user;
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') payload: UpdateUserDto,
  ) {
    const user = await this.userService.updateUser(currentUserId, payload);
    return user;
  }
}
