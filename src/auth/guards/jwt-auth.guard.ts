import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Token no proporcionado');

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; email: string; rol: string; oficina_id?: string }>(
        token,
        { secret: process.env.JWT_SECRET ?? 'municipio-jwt-secret-2026' },
      );
      request['user'] = { id: payload.sub, email: payload.email, rol: payload.rol, oficina_id: payload.oficina_id };
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return true;
  }

  private extractToken(request: any): string | undefined {
    const [type, token] = (request.headers?.authorization ?? '').split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
