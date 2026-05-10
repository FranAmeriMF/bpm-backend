import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryNotificacionesDto } from './dto/query-notificaciones.dto';
import { paginar, paginationParams } from '../common/helpers/paginate.helper';

@Injectable()
export class NotificacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsuario(usuario_id: string, query: QueryNotificacionesDto) {
    const { page = 1, limit = 20, leida, tipo } = query;
    const { skip, take } = paginationParams(page, limit);

    const where: any = { usuario_id };
    if (leida !== undefined) where.leida = leida;
    if (tipo) where.tipo = tipo;

    const [data, total] = await Promise.all([
      this.prisma.notificacion.findMany({
        where, skip, take,
        orderBy: { fecha_creacion: 'desc' },
        include: { tramite: { select: { id: true, numero: true } } },
      }),
      this.prisma.notificacion.count({ where }),
    ]);

    return paginar(data, total, page, limit);
  }

  async countNoLeidas(usuario_id: string) {
    const count = await this.prisma.notificacion.count({ where: { usuario_id, leida: false } });
    return { no_leidas: count };
  }

  async marcarLeida(id: string) {
    const notif = await this.prisma.notificacion.findUnique({ where: { id } });
    if (!notif) throw new NotFoundException('Notificación no encontrada');
    return this.prisma.notificacion.update({
      where: { id },
      data: { leida: true, fecha_lectura: new Date() },
    });
  }

  async marcarTodasLeidas(usuario_id: string) {
    await this.prisma.notificacion.updateMany({
      where: { usuario_id, leida: false },
      data: { leida: true, fecha_lectura: new Date() },
    });
    return { mensaje: 'Todas las notificaciones marcadas como leídas' };
  }

  async remove(id: string) {
    const notif = await this.prisma.notificacion.findUnique({ where: { id } });
    if (!notif) throw new NotFoundException('Notificación no encontrada');
    return this.prisma.notificacion.delete({ where: { id } });
  }
}
