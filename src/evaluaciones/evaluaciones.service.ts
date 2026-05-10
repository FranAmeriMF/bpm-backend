import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EvaluarSeccionDto } from './dto/evaluar-seccion.dto';

@Injectable()
export class EvaluacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async evaluarSeccion(dto: EvaluarSeccionDto) {
    if (!dto.aprobada && !dto.motivo_rechazo) {
      throw new BadRequestException('El motivo de rechazo es obligatorio cuando la sección no es aprobada');
    }

    const asignacion = await this.prisma.asignacionOficina.findUnique({
      where: { id: dto.asignacion_oficina_id },
    });
    if (!asignacion) throw new NotFoundException('Asignación de oficina no encontrada');

    const seccion = await this.prisma.seccionTipoTramite.findUnique({
      where: { id: dto.seccion_id },
    });
    if (!seccion) throw new NotFoundException('Sección no encontrada');

    return this.prisma.evaluacionSeccion.upsert({
      where: {
        asignacion_oficina_id_seccion_id: {
          asignacion_oficina_id: dto.asignacion_oficina_id,
          seccion_id: dto.seccion_id,
        },
      },
      update: {
        aprobada: dto.aprobada,
        motivo_rechazo: dto.motivo_rechazo ?? null,
        evaluado_por: dto.evaluado_por,
        fecha_evaluacion: new Date(),
      },
      create: {
        asignacion_oficina_id: dto.asignacion_oficina_id,
        seccion_id: dto.seccion_id,
        aprobada: dto.aprobada,
        motivo_rechazo: dto.motivo_rechazo,
        evaluado_por: dto.evaluado_por,
      },
      include: {
        seccion: { select: { id: true, titulo: true, orden: true } },
        evaluador: { select: { id: true, nombre: true, apellido: true } },
      },
    });
  }

  async getEvaluacionesByTramite(tramite_id: string) {
    return this.prisma.evaluacionSeccion.findMany({
      where: {
        asignacion_oficina: { tramite_id },
      },
      include: {
        asignacion_oficina: { include: { oficina: true } },
        seccion: { select: { id: true, titulo: true, orden: true } },
        evaluador: { select: { id: true, nombre: true, apellido: true } },
      },
      orderBy: [{ asignacion_oficina_id: 'asc' }, { seccion: { orden: 'asc' } }],
    });
  }

  async getProgreso(asignacion_id: string) {
    const asignacion = await this.prisma.asignacionOficina.findUnique({
      where: { id: asignacion_id },
      include: {
        evaluaciones_secciones: { include: { seccion: true } },
        tramite: {
          include: {
            tipo_tramite: {
              include: { _count: { select: { secciones: true } } },
            },
          },
        },
      },
    });
    if (!asignacion) throw new NotFoundException('Asignación no encontrada');

    const totalSecciones = asignacion.tramite.tipo_tramite._count.secciones;
    const evaluadas = asignacion.evaluaciones_secciones.length;
    const aprobadas = asignacion.evaluaciones_secciones.filter(e => e.aprobada).length;

    return {
      asignacion_id,
      total_secciones: totalSecciones,
      evaluadas,
      aprobadas,
      rechazadas: evaluadas - aprobadas,
      porcentaje: totalSecciones > 0 ? Math.round((evaluadas / totalSecciones) * 100) : 0,
      completada: evaluadas === totalSecciones,
      detalle: asignacion.evaluaciones_secciones.map(e => ({
        seccion_id: e.seccion_id,
        titulo: e.seccion.titulo,
        orden: e.seccion.orden,
        aprobada: e.aprobada,
        motivo_rechazo: e.motivo_rechazo,
      })),
    };
  }

  async updateEvaluacion(id: string, dto: EvaluarSeccionDto) {
    const ev = await this.prisma.evaluacionSeccion.findUnique({ where: { id } });
    if (!ev) throw new NotFoundException('Evaluación no encontrada');
    if (!dto.aprobada && !dto.motivo_rechazo) {
      throw new BadRequestException('El motivo de rechazo es obligatorio cuando la sección no es aprobada');
    }
    return this.prisma.evaluacionSeccion.update({
      where: { id },
      data: {
        aprobada: dto.aprobada,
        motivo_rechazo: dto.motivo_rechazo ?? null,
        evaluado_por: dto.evaluado_por,
        fecha_evaluacion: new Date(),
      },
      include: {
        seccion: { select: { id: true, titulo: true, orden: true } },
        evaluador: { select: { id: true, nombre: true, apellido: true } },
      },
    });
  }

  async getEvaluacionById(id: string) {
    const ev = await this.prisma.evaluacionSeccion.findUnique({
      where: { id },
      include: {
        asignacion_oficina: { include: { oficina: true } },
        seccion: { select: { id: true, titulo: true, orden: true } },
        evaluador: { select: { id: true, nombre: true, apellido: true } },
      },
    });
    if (!ev) throw new NotFoundException('Evaluación no encontrada');
    return ev;
  }
}
