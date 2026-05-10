import {
  Injectable, NotFoundException, BadRequestException, ConflictException,
} from '@nestjs/common';
import { ModoAsignacion, TipoTramiteStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginar, paginationParams } from '../common/helpers/paginate.helper';
import { CreateTiposTramiteDto } from './dto/create-tipos-tramite.dto';
import { UpdateTiposTramiteDto } from './dto/update-tipos-tramite.dto';
import { QueryTiposTramiteDto } from './dto/query-tipos-tramite.dto';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';
import { CreateCampoDto } from './dto/create-campo.dto';
import { UpdateCampoDto } from './dto/update-campo.dto';
import { SetModoAsignacionDto } from './dto/set-modo-asignacion.dto';

@Injectable()
export class TiposTramiteService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private async findOrFail(id: string) {
    const tipo = await this.prisma.tipoTramite.findUnique({
      where: { id },
      include: {
        secciones: { include: { campos: { orderBy: { orden: 'asc' } } }, orderBy: { orden: 'asc' } },
        oficinas_asignacion: { include: { oficina: { select: { id: true, nombre: true, codigo: true } } } },
      },
    });
    if (!tipo) throw new NotFoundException('Tipo de trámite no encontrado');
    return tipo;
  }

  private async checkNombreUnico(nombre: string, excludeId?: string) {
    const existe = await this.prisma.tipoTramite.findFirst({
      where: { nombre: { equals: nombre, mode: 'insensitive' }, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (existe) throw new ConflictException('Ya existe un tipo de trámite con este nombre');
  }

  private requireBorrador(tipo: { estado: TipoTramiteStatus }) {
    if (tipo.estado !== TipoTramiteStatus.borrador) {
      throw new BadRequestException(
        'Solo se puede modificar un tipo de trámite en estado borrador. Use POST /nueva-version para crear una versión editable.',
      );
    }
  }

  // ─── CRUD Base ────────────────────────────────────────────────────────────────

  async create(dto: CreateTiposTramiteDto) {
    await this.checkNombreUnico(dto.nombre);

    const existeCodigo = await this.prisma.tipoTramite.findFirst({
      where: { codigo: dto.codigo, version: 1 },
    });
    if (existeCodigo) throw new ConflictException('Ya existe un tipo de trámite con este código');

    return this.prisma.tipoTramite.create({
      data: { nombre: dto.nombre, descripcion: dto.descripcion, codigo: dto.codigo, version: 1 },
    });
  }

  async findAll(query: QueryTiposTramiteDto) {
    const { page = 1, limit = 20, estado, requiere_pago, buscar } = query;
    const { skip, take } = paginationParams(page, limit);

    const where: any = {};
    if (estado) where.estado = estado;
    if (requiere_pago !== undefined) where.requiere_pago = requiere_pago;
    if (buscar) {
      where.OR = [
        { nombre: { contains: buscar, mode: 'insensitive' } },
        { codigo: { contains: buscar, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.tipoTramite.findMany({
        where, skip, take,
        include: { _count: { select: { secciones: true, tramites: true } } },
        orderBy: [{ nombre: 'asc' }, { version: 'desc' }],
      }),
      this.prisma.tipoTramite.count({ where }),
    ]);

    return paginar(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.findOrFail(id);
  }

  async update(id: string, dto: UpdateTiposTramiteDto) {
    const tipo = await this.findOrFail(id);
    this.requireBorrador(tipo);

    if (dto.nombre && dto.nombre !== tipo.nombre) {
      await this.checkNombreUnico(dto.nombre, id);
    }

    return this.prisma.tipoTramite.update({
      where: { id },
      data: { nombre: dto.nombre, descripcion: dto.descripcion },
      include: {
        secciones: { include: { campos: true }, orderBy: { orden: 'asc' } },
        oficinas_asignacion: { include: { oficina: { select: { id: true, nombre: true, codigo: true } } } },
      },
    });
  }

  async remove(id: string) {
    const tipo = await this.findOrFail(id);
    if (tipo.estado !== TipoTramiteStatus.borrador) {
      throw new BadRequestException('Solo se puede eliminar un tipo de trámite en estado borrador');
    }
    return this.prisma.tipoTramite.delete({ where: { id } });
  }

  // ─── Ciclo de vida (activar / versionar) ─────────────────────────────────────

  async activar(id: string) {
    const tipo = await this.findOrFail(id);
    if (tipo.estado !== TipoTramiteStatus.borrador) {
      throw new BadRequestException('Solo se puede activar un tipo de trámite en estado borrador');
    }
    if (tipo.secciones.length === 0) {
      throw new BadRequestException('El tipo de trámite debe tener al menos una sección antes de activarse');
    }

    // Desactivar versión activa anterior del mismo código (si existe)
    await this.prisma.tipoTramite.updateMany({
      where: { codigo: tipo.codigo, estado: TipoTramiteStatus.activo, NOT: { id } },
      data: { estado: TipoTramiteStatus.inactivo },
    });

    return this.prisma.tipoTramite.update({
      where: { id },
      data: { estado: TipoTramiteStatus.activo },
      include: { secciones: { include: { campos: true }, orderBy: { orden: 'asc' } } },
    });
  }

  async crearNuevaVersion(id: string) {
    const tipo = await this.findOrFail(id);
    if (tipo.estado !== TipoTramiteStatus.activo) {
      throw new BadRequestException('Solo se puede crear una nueva versión a partir de un tipo activo');
    }

    const maxVersion = await this.prisma.tipoTramite.aggregate({
      where: { codigo: tipo.codigo },
      _max: { version: true },
    });
    const nuevaVersion = (maxVersion._max.version ?? 1) + 1;

    // Verificar que el nombre no conflictúe (se puede heredar el mismo)
    const nuevaTipo = await this.prisma.tipoTramite.create({
      data: {
        nombre: tipo.nombre,
        descripcion: tipo.descripcion,
        codigo: tipo.codigo,
        version: nuevaVersion,
        modo_asignacion: tipo.modo_asignacion,
      },
    });

    // Copiar oficinas de asignación
    if (tipo.oficinas_asignacion.length > 0) {
      await this.prisma.tipoTramiteOficina.createMany({
        data: tipo.oficinas_asignacion.map(oa => ({
          tipo_tramite_id: nuevaTipo.id,
          oficina_id: oa.oficina_id,
        })),
      });
    }

    // Copiar secciones y campos
    for (const sec of tipo.secciones) {
      const nuevaSec = await this.prisma.seccionTipoTramite.create({
        data: {
          tipo_tramite_id: nuevaTipo.id,
          titulo: sec.titulo,
          descripcion: sec.descripcion,
          orden: sec.orden,
        },
      });
      if (sec.campos.length > 0) {
        await this.prisma.campoSeccionTipoTramite.createMany({
          data: sec.campos.map(c => ({
            seccion_id: nuevaSec.id,
            nombre: c.nombre,
            etiqueta: c.etiqueta,
            tipo: c.tipo,
            obligatorio: c.obligatorio,
            placeholder: c.placeholder,
            descripcion: c.descripcion,
            valor_defecto: c.valor_defecto as any,
            opciones: c.opciones as any,
            validaciones: c.validaciones as any,
            orden: c.orden,
          })),
        });
      }
    }

    return this.prisma.tipoTramite.findUnique({
      where: { id: nuevaTipo.id },
      include: { secciones: { include: { campos: { orderBy: { orden: 'asc' } } }, orderBy: { orden: 'asc' } } },
    });
  }

  // ─── Modo de Asignación ───────────────────────────────────────────────────────

  async setModoAsignacion(id: string, dto: SetModoAsignacionDto) {
    const tipo = await this.findOrFail(id);
    this.requireBorrador(tipo);

    if (dto.modo_asignacion === ModoAsignacion.automatico) {
      if (!dto.oficinas_ids?.length) {
        throw new BadRequestException('Debe seleccionar al menos una oficina para asignación automática');
      }
      const activas = await this.prisma.oficina.count({
        where: { id: { in: dto.oficinas_ids }, estado: 'activa' },
      });
      if (activas !== dto.oficinas_ids.length) {
        throw new BadRequestException('Una o más oficinas seleccionadas no están activas');
      }
    }

    // Actualizar modo y reemplazar oficinas en tabla intermedia dentro de una transacción
    const [updatedTipo] = await this.prisma.$transaction([
      this.prisma.tipoTramite.update({
        where: { id },
        data: { modo_asignacion: dto.modo_asignacion },
      }),
      this.prisma.tipoTramiteOficina.deleteMany({ where: { tipo_tramite_id: id } }),
    ]);

    if (dto.modo_asignacion === ModoAsignacion.automatico && dto.oficinas_ids?.length) {
      await this.prisma.tipoTramiteOficina.createMany({
        data: dto.oficinas_ids.map(oficina_id => ({ tipo_tramite_id: id, oficina_id })),
      });
    }

    return this.findOrFail(updatedTipo.id);
  }

  // ─── Secciones ────────────────────────────────────────────────────────────────

  async addSeccion(id: string, dto: CreateSeccionDto) {
    const tipo = await this.findOrFail(id);
    this.requireBorrador(tipo);

    const orden = tipo.secciones.length + 1;

    const seccion = await this.prisma.seccionTipoTramite.create({
      data: {
        tipo_tramite_id: id,
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        orden,
      },
      include: { campos: true },
    });

    return seccion;
  }

  async updateSeccion(id: string, seccion_id: string, dto: UpdateSeccionDto) {
    const tipo = await this.findOrFail(id);
    this.requireBorrador(tipo);

    const seccion = tipo.secciones.find(s => s.id === seccion_id);
    if (!seccion) throw new NotFoundException('Sección no encontrada en este tipo de trámite');

    return this.prisma.seccionTipoTramite.update({
      where: { id: seccion_id },
      data: { titulo: dto.titulo, descripcion: dto.descripcion },
      include: { campos: { orderBy: { orden: 'asc' } } },
    });
  }

  async deleteSeccion(id: string, seccion_id: string) {
    const tipo = await this.findOrFail(id);
    this.requireBorrador(tipo);

    const seccion = tipo.secciones.find(s => s.id === seccion_id);
    if (!seccion) throw new NotFoundException('Sección no encontrada en este tipo de trámite');
    if (seccion.campos.length > 0) {
      throw new BadRequestException('La sección tiene campos. Elimínelos antes de borrar la sección.');
    }

    await this.prisma.seccionTipoTramite.delete({ where: { id: seccion_id } });

    // Reordenar las restantes
    const restantes = tipo.secciones.filter(s => s.id !== seccion_id);
    for (let i = 0; i < restantes.length; i++) {
      await this.prisma.seccionTipoTramite.update({
        where: { id: restantes[i].id },
        data: { orden: i + 1 },
      });
    }

    return { mensaje: 'Sección eliminada correctamente' };
  }

  async reorderSecciones(id: string, ordenIds: string[]) {
    const tipo = await this.findOrFail(id);
    this.requireBorrador(tipo);

    if (ordenIds.length !== tipo.secciones.length) {
      throw new BadRequestException('La lista debe incluir exactamente todas las secciones del tipo');
    }
    for (const sid of ordenIds) {
      if (!tipo.secciones.find(s => s.id === sid)) {
        throw new BadRequestException(`Sección ${sid} no pertenece a este tipo de trámite`);
      }
    }

    await this.prisma.$transaction(
      ordenIds.map((sid, i) =>
        this.prisma.seccionTipoTramite.update({ where: { id: sid }, data: { orden: i + 1 } }),
      ),
    );

    return this.findOrFail(id);
  }

  // ─── Campos ───────────────────────────────────────────────────────────────────

  async addCampo(id: string, seccion_id: string, dto: CreateCampoDto) {
    const tipo = await this.findOrFail(id);
    this.requireBorrador(tipo);

    const seccion = tipo.secciones.find(s => s.id === seccion_id);
    if (!seccion) throw new NotFoundException('Sección no encontrada en este tipo de trámite');

    const todosLosCampos = tipo.secciones.flatMap(s => s.campos);
    if (todosLosCampos.some(c => c.nombre === dto.nombre)) {
      throw new ConflictException(`Ya existe un campo con el nombre "${dto.nombre}" en este tipo de trámite`);
    }

    return this.prisma.campoSeccionTipoTramite.create({
      data: {
        seccion_id,
        nombre: dto.nombre,
        etiqueta: dto.etiqueta,
        tipo: dto.tipo,
        obligatorio: dto.obligatorio ?? false,
        placeholder: dto.placeholder,
        descripcion: dto.descripcion,
        valor_defecto: dto.valor_defecto as any,
        opciones: dto.opciones as any,
        validaciones: dto.validaciones as any,
        orden: seccion.campos.length + 1,
      },
    });
  }

  async updateCampo(id: string, seccion_id: string, campo_id: string, dto: UpdateCampoDto) {
    const tipo = await this.findOrFail(id);
    this.requireBorrador(tipo);

    const seccion = tipo.secciones.find(s => s.id === seccion_id);
    if (!seccion) throw new NotFoundException('Sección no encontrada en este tipo de trámite');

    const campo = seccion.campos.find(c => c.id === campo_id);
    if (!campo) throw new NotFoundException('Campo no encontrado en esta sección');

    if (dto.nombre && dto.nombre !== campo.nombre) {
      const todosLosCampos = tipo.secciones.flatMap(s => s.campos);
      if (todosLosCampos.some(c => c.nombre === dto.nombre && c.id !== campo_id)) {
        throw new ConflictException(`Ya existe un campo con el nombre "${dto.nombre}"`);
      }
    }

    return this.prisma.campoSeccionTipoTramite.update({
      where: { id: campo_id },
      data: {
        nombre: dto.nombre,
        etiqueta: dto.etiqueta,
        tipo: dto.tipo,
        obligatorio: dto.obligatorio,
        placeholder: dto.placeholder,
        descripcion: dto.descripcion,
        valor_defecto: dto.valor_defecto as any,
        opciones: dto.opciones as any,
        validaciones: dto.validaciones as any,
      },
    });
  }

  async deleteCampo(id: string, seccion_id: string, campo_id: string) {
    const tipo = await this.findOrFail(id);
    this.requireBorrador(tipo);

    const seccion = tipo.secciones.find(s => s.id === seccion_id);
    if (!seccion) throw new NotFoundException('Sección no encontrada en este tipo de trámite');

    const campo = seccion.campos.find(c => c.id === campo_id);
    if (!campo) throw new NotFoundException('Campo no encontrado en esta sección');

    await this.prisma.campoSeccionTipoTramite.delete({ where: { id: campo_id } });

    // Reordenar los restantes
    const restantes = seccion.campos.filter(c => c.id !== campo_id);
    for (let i = 0; i < restantes.length; i++) {
      await this.prisma.campoSeccionTipoTramite.update({
        where: { id: restantes[i].id },
        data: { orden: i + 1 },
      });
    }

    return { mensaje: `Campo "${campo.nombre}" eliminado correctamente` };
  }

  async reorderCampos(id: string, seccion_id: string, ordenIds: string[]) {
    const tipo = await this.findOrFail(id);
    this.requireBorrador(tipo);

    const seccion = tipo.secciones.find(s => s.id === seccion_id);
    if (!seccion) throw new NotFoundException('Sección no encontrada en este tipo de trámite');

    if (ordenIds.length !== seccion.campos.length) {
      throw new BadRequestException('La lista debe incluir exactamente todos los campos de la sección');
    }
    for (const cid of ordenIds) {
      if (!seccion.campos.find(c => c.id === cid)) {
        throw new BadRequestException(`Campo ${cid} no pertenece a esta sección`);
      }
    }

    await this.prisma.$transaction(
      ordenIds.map((cid, i) =>
        this.prisma.campoSeccionTipoTramite.update({ where: { id: cid }, data: { orden: i + 1 } }),
      ),
    );

    return this.findOrFail(id);
  }
}
