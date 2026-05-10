import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TramiteEstado, AsignacionEstado } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { AsignarTramiteDto } from './dto/asignar-tramite.dto';
import { DecisionFinalDto } from './dto/decision-final.dto';
import { QueryTramitesDto } from './dto/query-tramites.dto';
import { TramiteSeccionDto } from './dto/tramite-seccion.dto';
import { paginar, paginationParams } from '../common/helpers/paginate.helper';

@Injectable()
export class TramitesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async generarNumero(): Promise<string> {
    const year = new Date().getFullYear();
    const ultimo = await this.prisma.tramite.findFirst({
      where: { numero: { startsWith: `${year}-` } },
      orderBy: { numero: 'desc' },
    });
    let seq = 1;
    if (ultimo) {
      const partes = ultimo.numero.split('-');
      seq = parseInt(partes[1], 10) + 1;
    }
    return `${year}-${seq.toString().padStart(5, '0')}`;
  }

  private async registrarHistorial(
    tramite_id: string,
    estado_anterior: string | null,
    estado_nuevo: string,
    usuario_id?: string,
    comentario?: string,
    metadata?: object,
  ) {
    await this.prisma.historialEstado.create({
      data: {
        tramite_id,
        estado_anterior,
        estado_nuevo,
        usuario_id,
        comentario,
        metadata: metadata as any,
      },
    });
  }

  private async crearNotificacion(data: {
    usuario_id: string;
    tramite_id?: string;
    tipo?: 'info' | 'warning' | 'success' | 'error';
    titulo: string;
    mensaje: string;
    accion_url?: string;
  }) {
    await this.prisma.notificacion.create({ data: data as any });
  }

  private async guardarSecciones(
    tramite_id: string,
    secciones: TramiteSeccionDto[],
    usuario_id: string | undefined,
    accion: string,
  ) {
    for (const sec of secciones) {
      const tramiteSeccion = await this.prisma.tramiteSeccion.upsert({
        where: { tramite_id_seccion_id: { tramite_id, seccion_id: sec.seccion_id } },
        create: { tramite_id, seccion_id: sec.seccion_id },
        update: {},
      });
      for (const campo of sec.campos) {
        await this.prisma.tramiteCampo.upsert({
          where: { tramite_seccion_id_campo_id: { tramite_seccion_id: tramiteSeccion.id, campo_id: campo.campo_id } },
          create: { tramite_seccion_id: tramiteSeccion.id, campo_id: campo.campo_id, valor: campo.valor as any },
          update: { valor: campo.valor as any },
        });
      }
    }
    await this.crearSnapshotDatos(tramite_id, usuario_id, accion);
  }

  private async crearSnapshotDatos(
    tramite_id: string,
    usuario_id: string | undefined,
    accion: string,
  ) {
    const secciones = await this.prisma.tramiteSeccion.findMany({
      where: { tramite_id },
      include: {
        seccion: { select: { id: true, titulo: true, orden: true } },
        campos: {
          include: {
            campo: { select: { id: true, etiqueta: true, tipo: true } },
          },
        },
      },
    });
    await this.prisma.historialDatosTramite.create({
      data: {
        tramite_id,
        usuario_id,
        accion,
        datos: secciones as any,
      },
    });
  }

  private async validarCamposObligatorios(tramite_id: string, tipo_tramite_id: string) {
    const campos_obligatorios = await this.prisma.campoSeccionTipoTramite.findMany({
      where: { seccion: { tipo_tramite_id }, obligatorio: true },
      include: { seccion: { select: { titulo: true } } },
    });
    if (campos_obligatorios.length === 0) return;

    const campos_guardados = await this.prisma.tramiteCampo.findMany({
      where: { tramite_seccion: { tramite_id } },
      select: { campo_id: true, valor: true },
    });
    const ids_con_valor = new Set(
      campos_guardados.filter((c) => c.valor !== null).map((c) => c.campo_id),
    );

    const faltantes = campos_obligatorios.filter((c) => !ids_con_valor.has(c.id));
    if (faltantes.length > 0) {
      const nombres = faltantes.map((c) => `"${c.etiqueta}" (${c.seccion.titulo})`).join(', ');
      throw new BadRequestException(`Campos obligatorios sin completar: ${nombres}`);
    }
  }

  // ─── Estadísticas ────────────────────────────────────────────────────────────

  async getEstadisticas() {
    const grupos = await this.prisma.tramite.groupBy({
      by: ['estado'],
      _count: { _all: true },
    });
    const por_estado: Record<string, number> = {};
    let total = 0;
    for (const g of grupos) {
      por_estado[g.estado] = g._count._all;
      total += g._count._all;
    }
    return { por_estado, total };
  }

  // ─── CRUD Base ───────────────────────────────────────────────────────────────

  async create(dto: CreateTramiteDto) {
    const numero = await this.generarNumero();
    const tramite = await this.prisma.tramite.create({
      data: {
        numero,
        empresa_id: dto.empresa_id,
        tipo_tramite_id: dto.tipo_tramite_id,
        solicitante_id: dto.solicitante_id,
        oficina_empresa_id: dto.oficina_empresa_id,
        estado: TramiteEstado.borrador,
      },
    });
    await this.registrarHistorial(tramite.id, null, TramiteEstado.borrador, dto.solicitante_id, 'Trámite creado');
    if (dto.secciones?.length) {
      await this.guardarSecciones(tramite.id, dto.secciones, dto.solicitante_id, 'creacion');
    }
    return tramite;
  }

  async findAll(query: QueryTramitesDto, currentUser?: import('../auth/decorators/current-user.decorator').RequestUser) {
    const {
      page = 1, limit = 20,
      empresa_id, estado, tipo_tramite_id, solicitante_id,
      oficina_empresa_id, numero, fecha_desde, fecha_hasta,
    } = query;
    const { skip, take } = paginationParams(page, limit);

    const where: any = {};
    if (empresa_id) where.empresa_id = empresa_id;
    if (estado) where.estado = estado;
    if (tipo_tramite_id) where.tipo_tramite_id = tipo_tramite_id;
    if (solicitante_id) where.solicitante_id = solicitante_id;
    if (oficina_empresa_id) where.oficina_empresa_id = oficina_empresa_id;
    if (numero) where.numero = { contains: numero };
    if (fecha_desde ?? fecha_hasta) {
      where.fecha_creacion = {};
      if (fecha_desde) where.fecha_creacion.gte = new Date(fecha_desde);
      if (fecha_hasta) where.fecha_creacion.lte = new Date(fecha_hasta);
    }

    // Scope por rol: jefe_oficina e interno solo ven los tramites de su oficina o donde son decisores
    if (currentUser?.rol === 'jefe_oficina' || currentUser?.rol === 'interno') {
      const oficina_id = currentUser.oficina_id ?? (
        await this.prisma.user.findUnique({ where: { id: currentUser.id }, select: { oficina_id: true } })
      )?.oficina_id;

      if (oficina_id) {
        if (currentUser.rol === 'jefe_oficina') {
          where.OR = [
            { asignaciones_oficinas: { some: { oficina_id } } },
            { jefe_decisor_id: currentUser.id },
          ];
        } else {
          where.asignaciones_oficinas = { some: { oficina_id } };
        }
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.tramite.findMany({
        where, skip, take,
        include: {
          empresa: { select: { id: true, razon_social: true } },
          tipo_tramite: { select: { id: true, nombre: true, codigo: true } },
          solicitante: { select: { id: true, nombre: true, apellido: true } },
        },
        orderBy: { fecha_creacion: 'desc' },
      }),
      this.prisma.tramite.count({ where }),
    ]);

    return paginar(data, total, page, limit);
  }

  async findOne(id: string) {
    const tramite = await this.prisma.tramite.findUnique({
      where: { id },
      include: {
        empresa: true,
        tipo_tramite: {
          include: {
            secciones: {
              include: { campos: { orderBy: { orden: 'asc' } } },
              orderBy: { orden: 'asc' },
            },
          },
        },
        solicitante: true,
        jefe_decisor: true,
        archivos: true,
        asignaciones_oficinas: {
          include: {
            oficina: { select: { id: true, nombre: true } },
            jefe_asignado: { select: { id: true, nombre: true, apellido: true } },
            evaluaciones_secciones: {
              include: {
                seccion: { select: { id: true, titulo: true, orden: true } },
                evaluador: { select: { id: true, nombre: true, apellido: true } },
              },
              orderBy: { seccion: { orden: 'asc' } },
            },
          },
        },
        secciones_datos: {
          include: {
            seccion: true,
            campos: { include: { campo: true } },
          },
          orderBy: { seccion: { orden: 'asc' } },
        },
        historial_datos: { orderBy: { fecha: 'desc' } },
        historial: {
          include: {
            usuario: { select: { id: true, nombre: true, apellido: true, rol: true, email: true } },
          },
          orderBy: { fecha_cambio: 'asc' },
        },
        decision_final: true,
      },
    });
    if (!tramite) throw new NotFoundException('Trámite no encontrado');
    return tramite;
  }

  async update(id: string, dto: UpdateTramiteDto) {
    const tramite = await this.prisma.tramite.findUnique({ where: { id } });
    if (!tramite) throw new NotFoundException('Trámite no encontrado');
    if (tramite.estado !== TramiteEstado.borrador && tramite.estado !== TramiteEstado.corrigiendo) {
      throw new BadRequestException('Solo se puede editar un trámite en estado borrador o corrigiendo');
    }
    const data: any = {};
    if (dto.oficina_empresa_id !== undefined) data.oficina_empresa_id = dto.oficina_empresa_id;
    const updated = await this.prisma.tramite.update({ where: { id }, data });
    if (dto.secciones?.length) {
      await this.guardarSecciones(id, dto.secciones, undefined, 'actualizacion');
    }
    return updated;
  }

  async remove(id: string) {
    const tramite = await this.prisma.tramite.findUnique({ where: { id } });
    if (!tramite) throw new NotFoundException('Trámite no encontrado');
    if (tramite.estado !== TramiteEstado.borrador) {
      throw new BadRequestException('Solo se puede eliminar un trámite en estado borrador');
    }
    return this.prisma.tramite.delete({ where: { id } });
  }

  // ─── Workflow ────────────────────────────────────────────────────────────────

  async enviarDirector(id: string, solicitante_id: string) {
    const tramite = await this.prisma.tramite.findUnique({
      where: { id },
      include: { empresa: { include: { director: true } }, tipo_tramite: true, solicitante: true },
    });
    if (!tramite) throw new NotFoundException('Trámite no encontrado');
    if (tramite.estado !== TramiteEstado.borrador) {
      throw new BadRequestException('El trámite debe estar en borrador para enviarlo al director');
    }
    await this.validarCamposObligatorios(id, tramite.tipo_tramite_id);
    const updated = await this.prisma.tramite.update({
      where: { id },
      data: { estado: TramiteEstado.en_revision_interna, fecha_envio_director: new Date() },
    });
    await this.registrarHistorial(id, TramiteEstado.borrador, TramiteEstado.en_revision_interna, solicitante_id, 'Trámite enviado a revisión del director');

    const director = tramite.empresa?.director;
    if (director) {
      await this.crearNotificacion({
        usuario_id: director.id,
        tramite_id: id,
        tipo: 'info',
        titulo: `Trámite ${tramite.numero} requiere tu revisión`,
        mensaje: `El solicitante envió el trámite ${tramite.numero} para tu aprobación interna.`,
        accion_url: `/tramites/${id}`,
      });
      void this.mail.enviarAlDirector(director.email, {
        nombre_solicitante: `${tramite.solicitante.nombre} ${tramite.solicitante.apellido}`,
        numero_tramite: tramite.numero,
        tipo_tramite: tramite.tipo_tramite.nombre,
        empresa: tramite.empresa.razon_social,
        url_tramite: `/tramites/${id}`,
      });
    }
    return updated;
  }

  async aprobarDirector(id: string, director_id: string) {
    const tramite = await this.prisma.tramite.findUnique({ where: { id } });
    if (!tramite) throw new NotFoundException('Trámite no encontrado');
    if (tramite.estado !== TramiteEstado.en_revision_interna) {
      throw new BadRequestException('El trámite debe estar en revisión interna para aprobarlo');
    }
    const updated = await this.prisma.tramite.update({
      where: { id },
      data: {
        estado: TramiteEstado.pendiente_asignacion,
        fecha_aprobacion_director: new Date(),
        aprobado_por_director: true,
      },
    });
    await this.registrarHistorial(id, TramiteEstado.en_revision_interna, TramiteEstado.pendiente_asignacion, director_id, 'Director aprobó el trámite internamente');
    await this.crearNotificacion({
      usuario_id: tramite.solicitante_id,
      tramite_id: id,
      tipo: 'success',
      titulo: `Trámite ${tramite.numero} aprobado internamente`,
      mensaje: `El director aprobó tu trámite. Ahora espera la asignación a las oficinas evaluadoras.`,
      accion_url: `/tramites/${id}`,
    });
    return updated;
  }

  async rechazarDirector(id: string, director_id: string, observaciones: string) {
    const tramite = await this.prisma.tramite.findUnique({
      where: { id },
      include: { solicitante: true, empresa: true, tipo_tramite: true },
    });
    if (!tramite) throw new NotFoundException('Trámite no encontrado');
    if (tramite.estado !== TramiteEstado.en_revision_interna) {
      throw new BadRequestException('El trámite debe estar en revisión interna para rechazarlo');
    }
    const updated = await this.prisma.tramite.update({
      where: { id },
      data: {
        estado: TramiteEstado.borrador,
        aprobado_por_director: false,
        observaciones_director: observaciones,
      },
    });
    await this.registrarHistorial(id, TramiteEstado.en_revision_interna, TramiteEstado.borrador, director_id, `Director rechazó: ${observaciones}`);
    await this.crearNotificacion({
      usuario_id: tramite.solicitante_id,
      tramite_id: id,
      tipo: 'warning',
      titulo: `Trámite ${tramite.numero} devuelto por el director`,
      mensaje: `El director devolvió tu trámite con observaciones: ${observaciones}`,
      accion_url: `/tramites/${id}`,
    });
    void this.mail.enviarRechazoDirector(tramite.solicitante.email, {
      nombre_solicitante: `${tramite.solicitante.nombre} ${tramite.solicitante.apellido}`,
      numero_tramite: tramite.numero,
      tipo_tramite: tramite.tipo_tramite.nombre,
      empresa: tramite.empresa.razon_social,
      observaciones,
      url_tramite: `/tramites/${id}`,
    });
    return updated;
  }

  async asignar(id: string, dto: AsignarTramiteDto, moderador_id: string) {
    const tramite = await this.prisma.tramite.findUnique({
      where: { id },
      include: { empresa: true, tipo_tramite: true },
    });
    if (!tramite) throw new NotFoundException('Trámite no encontrado');
    if (tramite.estado !== TramiteEstado.pendiente_asignacion) {
      throw new BadRequestException('El trámite debe estar pendiente de asignación');
    }

    await this.prisma.$transaction(
      dto.oficinas.map((o) =>
        this.prisma.asignacionOficina.create({
          data: {
            tramite_id: id,
            oficina_id: o.oficina_id,
          },
        }),
      ),
    );

    const updated = await this.prisma.tramite.update({
      where: { id },
      data: {
        estado: TramiteEstado.asignado,
        fecha_asignacion: new Date(),
        jefe_decisor_id: dto.jefe_decisor_id,
      },
    });
    await this.registrarHistorial(id, TramiteEstado.pendiente_asignacion, TramiteEstado.asignado, moderador_id, 'Moderador asignó el trámite a oficinas');

    // Notificar a todos los jefes de oficina de cada oficina asignada
    const oficina_ids = dto.oficinas.map((o) => o.oficina_id);
    const jefes = await this.prisma.user.findMany({
      where: { oficina_id: { in: oficina_ids }, rol: 'jefe_oficina' },
    });
    for (const jefe of jefes) {
      await this.crearNotificacion({
        usuario_id: jefe.id,
        tramite_id: id,
        tipo: 'info',
        titulo: `Nuevo trámite asignado: ${tramite.numero}`,
        mensaje: `Tu oficina tiene asignado el trámite ${tramite.numero} para revisión técnica.`,
        accion_url: `/tramites/${id}`,
      });
      void this.mail.enviarAsignacionJefe(jefe.email, {
        nombre_solicitante: '',
        numero_tramite: tramite.numero,
        tipo_tramite: tramite.tipo_tramite.nombre,
        empresa: tramite.empresa.razon_social,
        url_tramite: `/tramites/${id}`,
      });
    }
    return { tramite: updated };
  }

  private async resolveOficinaId(user: import('../auth/decorators/current-user.decorator').RequestUser): Promise<string> {
    if (user.oficina_id) return user.oficina_id;
    const dbUser = await this.prisma.user.findUnique({ where: { id: user.id }, select: { oficina_id: true } });
    if (!dbUser?.oficina_id) throw new BadRequestException('No tenés una oficina asignada a tu cuenta');
    return dbUser.oficina_id;
  }

  async iniciarRevision(id: string, user: import('../auth/decorators/current-user.decorator').RequestUser) {
    const oficina_id = await this.resolveOficinaId(user);
    const asignacion = await this.prisma.asignacionOficina.findFirst({
      where: { tramite_id: id, oficina_id },
    });
    if (!asignacion) throw new NotFoundException('Tu oficina no tiene una asignación para este trámite');
    if (asignacion.estado !== AsignacionEstado.pendiente) {
      throw new BadRequestException('La asignación ya fue iniciada o completada');
    }

    const updatedAsignacion = await this.prisma.asignacionOficina.update({
      where: { id: asignacion.id },
      data: { estado: AsignacionEstado.en_revision, fecha_inicio_revision: new Date() },
    });

    const tramite = await this.prisma.tramite.findUnique({ where: { id } });
    if (tramite?.estado === TramiteEstado.asignado) {
      await this.prisma.tramite.update({ where: { id }, data: { estado: TramiteEstado.en_revision } });
      await this.registrarHistorial(id, TramiteEstado.asignado, TramiteEstado.en_revision, user.id, `Oficina ${oficina_id} inició la revisión`);
    }
    return updatedAsignacion;
  }

  async finalizarRevision(id: string, user: import('../auth/decorators/current-user.decorator').RequestUser) {
    const oficina_id = await this.resolveOficinaId(user);
    const asignacion = await this.prisma.asignacionOficina.findFirst({
      where: { tramite_id: id, oficina_id },
      include: {
        evaluaciones_secciones: true,
        tramite: {
          include: {
            tipo_tramite: { include: { _count: { select: { secciones: true } } } },
          },
        },
      },
    });
    if (!asignacion) throw new NotFoundException('Tu oficina no tiene una asignación para este trámite');
    if (asignacion.estado !== AsignacionEstado.en_revision) {
      throw new BadRequestException('La revisión debe estar en curso para finalizarla');
    }

    const totalSecciones = asignacion.tramite.tipo_tramite._count.secciones;
    if (totalSecciones > 0 && asignacion.evaluaciones_secciones.length < totalSecciones) {
      throw new BadRequestException(`Debes evaluar todas las secciones (${asignacion.evaluaciones_secciones.length}/${totalSecciones} completadas)`);
    }

    // Registrar quién finalizó la revisión de esta oficina
    await this.prisma.asignacionOficina.update({
      where: { id: asignacion.id },
      data: { estado: AsignacionEstado.completada, fecha_finalizacion: new Date(), jefe_asignado_id: user.id },
    });

    const todasCompletadas = await this.prisma.asignacionOficina.count({
      where: { tramite_id: id, estado: { not: AsignacionEstado.completada } },
    });

    if (todasCompletadas === 0) {
      await this.prisma.tramite.update({
        where: { id },
        data: { estado: TramiteEstado.en_revision_final, fecha_revision_final: new Date() },
      });
      await this.registrarHistorial(id, TramiteEstado.en_revision, TramiteEstado.en_revision_final, user.id, 'Todas las oficinas completaron su revisión');

      const tramite = await this.prisma.tramite.findUnique({
        where: { id },
        include: { tipo_tramite: true, empresa: true, jefe_decisor: true },
      });
      if (tramite?.jefe_decisor_id) {
        await this.crearNotificacion({
          usuario_id: tramite.jefe_decisor_id,
          tramite_id: id,
          tipo: 'info',
          titulo: `Trámite ${tramite.numero} listo para decisión final`,
          mensaje: `Todas las oficinas completaron su revisión. El trámite ${tramite.numero} requiere tu decisión final.`,
          accion_url: `/tramites/${id}`,
        });
        if (tramite.jefe_decisor) {
          void this.mail.enviarListoParaDecision(tramite.jefe_decisor.email, {
            nombre_solicitante: '',
            numero_tramite: tramite.numero,
            tipo_tramite: tramite.tipo_tramite.nombre,
            empresa: tramite.empresa.razon_social,
            url_tramite: `/tramites/${id}`,
          });
        }
      }
    }
    return { mensaje: todasCompletadas === 0 ? 'Todas las oficinas completaron. Trámite en revisión final.' : 'Revisión completada. Esperando otras oficinas.' };
  }

  async decisionFinal(id: string, dto: DecisionFinalDto, jefeDecisorId: string) {
    const tramite = await this.prisma.tramite.findUnique({
      where: { id },
      include: { solicitante: true, empresa: true, tipo_tramite: true },
    });
    if (!tramite) throw new NotFoundException('Trámite no encontrado');
    if (tramite.estado !== TramiteEstado.en_revision_final) {
      throw new BadRequestException('El trámite debe estar en revisión final para tomar una decisión');
    }

    const nuevoEstado = dto.decision as unknown as TramiteEstado;

    const decision = await this.prisma.decisionFinal.create({
      data: {
        tramite_id: id,
        jefe_decisor_id: jefeDecisorId,
        decision: dto.decision,
        secciones_a_corregir: dto.secciones_a_corregir as any,
        mensaje_al_solicitante: dto.mensaje_al_solicitante,
        plantilla_usada_id: dto.plantilla_usada_id,
      },
    });

    const estadoFinal = dto.decision === 'observado' ? TramiteEstado.observado : nuevoEstado;
    await this.prisma.tramite.update({
      where: { id },
      data: { estado: estadoFinal, fecha_decision_final: new Date(), jefe_decisor_id: jefeDecisorId },
    });

    await this.registrarHistorial(id, TramiteEstado.en_revision_final, estadoFinal, jefeDecisorId, `Decisión final: ${dto.decision}`);

    const tipo = dto.decision === 'aprobado' ? 'success' : dto.decision === 'observado' ? 'warning' : 'error';
    await this.crearNotificacion({
      usuario_id: tramite.solicitante_id,
      tramite_id: id,
      tipo,
      titulo: `Decisión sobre tu trámite ${tramite.numero}`,
      mensaje: dto.mensaje_al_solicitante,
      accion_url: `/tramites/${id}`,
    });

    const empresa = tramite.empresa;
    if (empresa?.director_id) {
      await this.crearNotificacion({
        usuario_id: empresa.director_id,
        tramite_id: id,
        tipo: 'info',
        titulo: `Decisión sobre trámite ${tramite.numero}`,
        mensaje: `El trámite ${tramite.numero} fue ${dto.decision}.`,
        accion_url: `/tramites/${id}`,
      });
    }

    void this.mail.enviarDecisionFinal(tramite.solicitante.email, dto.decision, {
      nombre_solicitante: `${tramite.solicitante.nombre} ${tramite.solicitante.apellido}`,
      numero_tramite: tramite.numero,
      tipo_tramite: tramite.tipo_tramite.nombre,
      empresa: tramite.empresa.razon_social,
      mensaje: dto.mensaje_al_solicitante,
      url_tramite: `/tramites/${id}`,
    });

    return { decision, estado: estadoFinal };
  }

  async iniciarCorreccion(id: string, solicitante_id: string) {
    const tramite = await this.prisma.tramite.findUnique({ where: { id } });
    if (!tramite) throw new NotFoundException('Trámite no encontrado');
    if (tramite.estado !== TramiteEstado.observado) {
      throw new BadRequestException('Solo se puede iniciar corrección en un trámite observado');
    }
    const updated = await this.prisma.tramite.update({
      where: { id },
      data: { estado: TramiteEstado.corrigiendo },
    });
    await this.registrarHistorial(id, TramiteEstado.observado, TramiteEstado.corrigiendo, solicitante_id, 'Solicitante inició corrección');
    return updated;
  }

  async reenviar(id: string, solicitante_id: string, secciones: TramiteSeccionDto[]) {
    const tramite = await this.prisma.tramite.findUnique({ where: { id } });
    if (!tramite) throw new NotFoundException('Trámite no encontrado');
    if (tramite.estado !== TramiteEstado.observado && tramite.estado !== TramiteEstado.corrigiendo) {
      throw new BadRequestException('Solo se puede reenviar un trámite en estado observado o corrigiendo');
    }

    await this.guardarSecciones(id, secciones, solicitante_id, 'reenvio_con_correcciones');

    await this.prisma.asignacionOficina.updateMany({
      where: { tramite_id: id },
      data: { estado: AsignacionEstado.pendiente, fecha_inicio_revision: null, fecha_finalizacion: null },
    });

    const updated = await this.prisma.tramite.update({
      where: { id },
      data: { estado: TramiteEstado.asignado, fecha_asignacion: new Date() },
    });
    await this.registrarHistorial(id, tramite.estado, TramiteEstado.asignado, solicitante_id, 'Solicitante reenvió el trámite con correcciones');
    return updated;
  }
}
