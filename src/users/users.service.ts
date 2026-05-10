import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { paginar, paginationParams } from '../common/helpers/paginate.helper';
import type { RequestUser } from '../auth/decorators/current-user.decorator';

function generarPasswordTemporal(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: createUserDto.email }, { dni: createUserDto.dni }] },
    });
    if (existing) throw new BadRequestException('Ya existe un usuario con ese email o DNI.');

    const passwordTemporal = generarPasswordTemporal();
    const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        requiere_cambio_password: true,
      },
    });

    void this.mail.enviarBienvenida(
      user.email,
      `${user.nombre} ${user.apellido}`,
      passwordTemporal,
    );

    const { password: _pw, ...userSafe } = user;
    return userSafe;
  }

  async findAll(query: QueryUsersDto) {
    const { page = 1, limit = 20, rol, tipo, estado, empresa_id, oficina_id, buscar } = query;
    const { skip, take } = paginationParams(page, limit);

    const ROLES_INTERNOS = ['admin', 'moderador', 'jefe_oficina', 'interno'];
    const ROLES_EXTERNOS  = ['solicitante', 'director'];

    const where: any = {};
    if (rol)        where.rol = rol;
    else if (tipo === 'interno') where.rol = { in: ROLES_INTERNOS };
    else if (tipo === 'externo') where.rol = { in: ROLES_EXTERNOS };
    if (estado)      where.estado     = estado;
    if (empresa_id)  where.empresa_id = empresa_id;
    if (oficina_id)  where.oficina_id = oficina_id;
    if (buscar) {
      where.OR = [
        { nombre:   { contains: buscar, mode: 'insensitive' } },
        { apellido: { contains: buscar, mode: 'insensitive' } },
        { email:    { contains: buscar, mode: 'insensitive' } },
        { dni:      { contains: buscar } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where, skip, take,
        select: {
          id: true, nombre: true, apellido: true, email: true, dni: true,
          telefono: true, rol: true, estado: true, cargo: true,
          empresa_id: true, oficina_id: true,
          empresa: { select: { id: true, razon_social: true } },
          oficina:  { select: { id: true, nombre: true, codigo: true } },
          fecha_creacion: true, ultimo_acceso: true, requiere_cambio_password: true,
        },
        orderBy: { fecha_creacion: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return paginar(data, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { empresa: true, oficina: true },
    });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    const { password: _pw, ...userSafe } = user;
    return userSafe;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  private async assertEmpresaAccess(targetUser: { empresa_id: string | null }, requestUser: RequestUser) {
    if (requestUser.rol !== 'director') return;
    const director = await this.prisma.user.findUnique({ where: { id: requestUser.id }, select: { empresa_id: true } });
    if (!director?.empresa_id || director.empresa_id !== targetUser.empresa_id) {
      throw new ForbiddenException('Solo podés gestionar usuarios de tu propia empresa');
    }
  }

  async changeStatus(id: string, estado: UserStatus, requestUser?: RequestUser) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    if (requestUser) await this.assertEmpresaAccess(user, requestUser);
    return this.prisma.user.update({ where: { id }, data: { estado } });
  }

  async resetPassword(id: string, requestUser?: RequestUser) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    if (requestUser) await this.assertEmpresaAccess(user, requestUser);

    const passwordTemporal = generarPasswordTemporal();
    const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword, requiere_cambio_password: true },
    });

    void this.mail.enviarResetPasswordAdmin(
      user.email,
      `${user.nombre} ${user.apellido}`,
      passwordTemporal,
    );

    return { mensaje: 'Contraseña temporal generada y enviada por email.' };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return this.prisma.user.delete({ where: { id } });
  }
}
