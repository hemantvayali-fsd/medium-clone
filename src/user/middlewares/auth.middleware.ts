import { JWT_SECRET } from '@app/config';
import { ExpressRequest } from '@app/types/express-request.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
      return next();
    }

    const token = authorization.split(' ')[1];
    try {
      const decode = verify(token, JWT_SECRET) as { id: number; email: string };
      const user = await this.userService.findUserById(decode.id);
      req.user = user;
      next();
    } catch (error) {
      next();
    }
  }
}
