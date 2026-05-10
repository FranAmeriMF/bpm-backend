import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { UpdateMeDto } from './dto/update-me.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mail: MailService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    if (user.estado !== 'activo') {
      throw new UnauthorizedException('Tu cuenta está inactiva o suspendida');
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { ultimo_acceso: new Date() } });

    const payload = { sub: user.id, email: user.email, rol: user.rol, oficina_id: user.oficina_id ?? undefined };
    const token = this.jwtService.sign(payload);

    const { password: _pw, ...userSafe } = user;
    return {
      access_token: token,
      user: userSafe,
      requiere_cambio_password: user.requiere_cambio_password,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, nombre: true, apellido: true, email: true,
        dni: true, telefono: true, rol: true, estado: true,
        empresa_id: true, oficina_id: true, cargo: true,
        fecha_creacion: true, ultimo_acceso: true,
        empresa: { select: { id: true, razon_social: true } },
        oficina: { select: { id: true, nombre: true } },
      },
    });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return user;
  }

  async changePassword(userId: string, passwordActual: string, passwordNuevo: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const valid = await bcrypt.compare(passwordActual, user.password);
    if (!valid) throw new BadRequestException('La contraseña actual es incorrecta');

    const hashed = await bcrypt.hash(passwordNuevo, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed, requiere_cambio_password: false },
    });
    return { mensaje: 'Contraseña actualizada correctamente.' };
  }

  refresh(userId: string, email: string, rol: string) {
    const token = this.jwtService.sign({ sub: userId, email, rol });
    return { access_token: token };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Always return same message to avoid user enumeration
    if (!user) return { mensaje: 'Si el email existe, recibirás un enlace de recuperación.' };

    const resetToken = this.jwtService.sign(
      { sub: user.id, purpose: 'reset' },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    void this.mail.enviarRecuperacionPassword(user.email, {
      nombre_solicitante: `${user.nombre} ${user.apellido}`,
      numero_tramite: '',
      tipo_tramite: '',
      empresa: '',
      url_tramite: `http://localhost:5173/reset-password?token=${resetToken}`,
    });

    return { mensaje: 'Si el email existe, recibirás un enlace de recuperación.' };
  }

  async resetPassword(token: string, nuevaPassword: string) {
    let payload: { sub: string; purpose: string };
    try {
      payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch {
      throw new BadRequestException('Token inválido o expirado');
    }
    if (payload.purpose !== 'reset') {
      throw new BadRequestException('Token inválido');
    }
    const hashed = await bcrypt.hash(nuevaPassword, 10);
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { password: hashed },
    });
    return { mensaje: 'Contraseña actualizada correctamente.' };
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true, nombre: true, apellido: true, email: true,
        dni: true, telefono: true, rol: true, estado: true,
        empresa_id: true, oficina_id: true, cargo: true,
        fecha_creacion: true, ultimo_acceso: true,
        empresa: { select: { id: true, razon_social: true } },
        oficina: { select: { id: true, nombre: true } },
      },
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
