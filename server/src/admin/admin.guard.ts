import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.cookies['admin_token'];
    console.log('TOKEN:', token);

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

  private shouldRefreshToken(decoded: any): boolean {
    const expiresIn = decoded.exp * 1000 - Date.now();
    return expiresIn < 30 * 60 * 1000;
  }
}
