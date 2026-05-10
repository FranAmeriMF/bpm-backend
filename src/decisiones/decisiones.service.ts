import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDecisionesDto } from './dto/query-decisiones.dto';
import { paginar, paginationParams } from '../common/helpers/paginate.helper';

@Injectable()
export class DecisionesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPendientes(jefe_decisor_id: string, page = 1, limit = 20) {
    const { skip, take } = paginationParams(page, limit);
    const where = { estado: 'en_revision_final' as const, jefe_decisor_id };

    const [data, total] = await Promise.all([
      this.prisma.tramite.findMany({
        where, skip, take,
        include: {
          tipo_tramite: true,
          empresa: { select: { id: true, razon_social: true } },
          solicitante: { select: { id: true, nombre: true, apellido: true } },
          asignaciones_oficinas: { include: { oficina: true, evaluaciones_secciones: true } },
        },
        orderBy: { fecha_revision_final: 'asc' },
      }),
      this.prisma.tramite.count({ where }),
    ]);

    return paginar(data, total, page, limit);
  }

  async getHistorial(jefe_decisor_id: string, query: QueryDecisionesDto) {
    const { page = 1, limit = 20, decision, fecha_desde, fecha_hasta } = query;
    const { skip, take } = paginationParams(page, limit);

    const where: any = { jefe_decisor_id };
    if (decision) where.decision = decision;
    if (fecha_desde ?? fecha_hasta) {
      where.fecha_decision = {};
      if (fecha_desde) where.fecha_decision.gte = new Date(fecha_desde);
      if (fecha_hasta) where.fecha_decision.lte = new Date(fecha_hasta);
    }

    const [data, total] = await Promise.all([
      this.prisma.decisionFinal.findMany({
        where, skip, take,
        include: {
          tramite: {
            include: {
              tipo_tramite: true,
              empresa: { select: { id: true, razon_social: true } },
              solicitante: { select: { id: true, nombre: true, apellido: true } },
            },
          },
          plantilla_usada: { select: { id: true, nombre: true } },
        },
        orderBy: { fecha_decision: 'desc' },
      }),
      this.prisma.decisionFinal.count({ where }),
    ]);

    return paginar(data, total, page, limit);
  }

  async getDetalle(id: string) {
    const decision = await this.prisma.decisionFinal.findUnique({
      where: { id },
      include: {
        tramite: {
          include: {
            tipo_tramite: true,
            empresa: true,
            solicitante: true,
            asignaciones_oficinas: { include: { oficina: true, evaluaciones_secciones: true } },
          },
        },
        jefe_decisor: { select: { id: true, nombre: true, apellido: true } },
        plantilla_usada: true,
      },
    });
    if (!decision) throw new NotFoundException('Decisión no encontrada');
    return decision;
  }

  async getSeguimiento(id: string) {
    const decision = await this.prisma.decisionFinal.findUnique({
      where: { id },
      include: {
        tramite: {
          include: {
            historial: { orderBy: { fecha_cambio: 'asc' } },
            asignaciones_oficinas: { include: { evaluaciones_secciones: true, oficina: true } },
          },
        },
      },
    });
    if (!decision) throw new NotFoundException('Decisión no encontrada');
    return {
      decision: decision.decision,
      secciones_a_corregir: decision.secciones_a_corregir,
      estado_actual: decision.tramite.estado,
      historial: decision.tramite.historial,
      asignaciones: decision.tramite.asignaciones_oficinas,
    };
  }
}
