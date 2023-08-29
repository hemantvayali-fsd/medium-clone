import { ExpressRequest } from '@app/types/express-request.interface';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    if (request.user) return true;
    throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
  }
}
