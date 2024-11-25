import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Client does not have token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.role !== 'admin') {
        throw new UnauthorizedException('Does not have admin authentication');
      }
      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string {
    if (!request.headers.authorization) {
      return undefined;
    }
    const [check, token] = request.headers.authorization.split(' ');
    return check.toLowerCase() === 'bearer' ? token : undefined;
  }
}
