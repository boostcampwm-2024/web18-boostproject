import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['admin_token'];

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
}
