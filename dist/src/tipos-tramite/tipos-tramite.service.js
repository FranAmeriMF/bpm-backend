"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposTramiteService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const paginate_helper_1 = require("../common/helpers/paginate.helper");
let TiposTramiteService = class TiposTramiteService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOrFail(id) {
        const tipo = await this.prisma.tipoTramite.findUnique({
            where: { id },
            include: {
                secciones: { include: { campos: { orderBy: { orden: 'asc' } } }, orderBy: { orden: 'asc' } },
                oficinas_asignacion: { include: { oficina: { select: { id: true, nombre: true, codigo: true } } } },
            },
        });
        if (!tipo)
            throw new common_1.NotFoundException('Tipo de trámite no encontrado');
        return tipo;
    }
    async checkNombreUnico(nombre, excludeId) {
        const existe = await this.prisma.tipoTramite.findFirst({
            where: { nombre: { equals: nombre, mode: 'insensitive' }, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
        });
        if (existe)
            throw new common_1.ConflictException('Ya existe un tipo de trámite con este nombre');
    }
    requireBorrador(tipo) {
        if (tipo.estado !== client_1.TipoTramiteStatus.borrador) {
            throw new common_1.BadRequestException('Solo se puede modificar un tipo de trámite en estado borrador. Use POST /nueva-version para crear una versión editable.');
        }
    }
    async create(dto) {
        await this.checkNombreUnico(dto.nombre);
        const existeCodigo = await this.prisma.tipoTramite.findFirst({
            where: { codigo: dto.codigo, version: 1 },
        });
        if (existeCodigo)
            throw new common_1.ConflictException('Ya existe un tipo de trámite con este código');
        return this.prisma.tipoTramite.create({
            data: { nombre: dto.nombre, descripcion: dto.descripcion, codigo: dto.codigo, version: 1 },
        });
    }
    async findAll(query) {
        const { page = 1, limit = 20, estado, requiere_pago, buscar } = query;
        const { skip, take } = (0, paginate_helper_1.paginationParams)(page, limit);
        const where = {};
        if (estado)
            where.estado = estado;
        if (requiere_pago !== undefined)
            where.requiere_pago = requiere_pago;
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
        return (0, paginate_helper_1.paginar)(data, total, page, limit);
    }
    async findOne(id) {
        return this.findOrFail(id);
    }
    async update(id, dto) {
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
    async remove(id) {
        const tipo = await this.findOrFail(id);
        if (tipo.estado !== client_1.TipoTramiteStatus.borrador) {
            throw new common_1.BadRequestException('Solo se puede eliminar un tipo de trámite en estado borrador');
        }
        return this.prisma.tipoTramite.delete({ where: { id } });
    }
    async activar(id) {
        const tipo = await this.findOrFail(id);
        if (tipo.estado !== client_1.TipoTramiteStatus.borrador) {
            throw new common_1.BadRequestException('Solo se puede activar un tipo de trámite en estado borrador');
        }
        if (tipo.secciones.length === 0) {
            throw new common_1.BadRequestException('El tipo de trámite debe tener al menos una sección antes de activarse');
        }
        await this.prisma.tipoTramite.updateMany({
            where: { codigo: tipo.codigo, estado: client_1.TipoTramiteStatus.activo, NOT: { id } },
            data: { estado: client_1.TipoTramiteStatus.inactivo },
        });
        return this.prisma.tipoTramite.update({
            where: { id },
            data: { estado: client_1.TipoTramiteStatus.activo },
            include: { secciones: { include: { campos: true }, orderBy: { orden: 'asc' } } },
        });
    }
    async crearNuevaVersion(id) {
        const tipo = await this.findOrFail(id);
        if (tipo.estado !== client_1.TipoTramiteStatus.activo) {
            throw new common_1.BadRequestException('Solo se puede crear una nueva versión a partir de un tipo activo');
        }
        const maxVersion = await this.prisma.tipoTramite.aggregate({
            where: { codigo: tipo.codigo },
            _max: { version: true },
        });
        const nuevaVersion = (maxVersion._max.version ?? 1) + 1;
        const nuevaTipo = await this.prisma.tipoTramite.create({
            data: {
                nombre: tipo.nombre,
                descripcion: tipo.descripcion,
                codigo: tipo.codigo,
                version: nuevaVersion,
                modo_asignacion: tipo.modo_asignacion,
            },
        });
        if (tipo.oficinas_asignacion.length > 0) {
            await this.prisma.tipoTramiteOficina.createMany({
                data: tipo.oficinas_asignacion.map(oa => ({
                    tipo_tramite_id: nuevaTipo.id,
                    oficina_id: oa.oficina_id,
                })),
            });
        }
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
                        valor_defecto: c.valor_defecto,
                        opciones: c.opciones,
                        validaciones: c.validaciones,
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
    async setModoAsignacion(id, dto) {
        const tipo = await this.findOrFail(id);
        this.requireBorrador(tipo);
        if (dto.modo_asignacion === client_1.ModoAsignacion.automatico) {
            if (!dto.oficinas_ids?.length) {
                throw new common_1.BadRequestException('Debe seleccionar al menos una oficina para asignación automática');
            }
            const activas = await this.prisma.oficina.count({
                where: { id: { in: dto.oficinas_ids }, estado: 'activa' },
            });
            if (activas !== dto.oficinas_ids.length) {
                throw new common_1.BadRequestException('Una o más oficinas seleccionadas no están activas');
            }
        }
        const [updatedTipo] = await this.prisma.$transaction([
            this.prisma.tipoTramite.update({
                where: { id },
                data: { modo_asignacion: dto.modo_asignacion },
            }),
            this.prisma.tipoTramiteOficina.deleteMany({ where: { tipo_tramite_id: id } }),
        ]);
        if (dto.modo_asignacion === client_1.ModoAsignacion.automatico && dto.oficinas_ids?.length) {
            await this.prisma.tipoTramiteOficina.createMany({
                data: dto.oficinas_ids.map(oficina_id => ({ tipo_tramite_id: id, oficina_id })),
            });
        }
        return this.findOrFail(updatedTipo.id);
    }
    async addSeccion(id, dto) {
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
    async updateSeccion(id, seccion_id, dto) {
        const tipo = await this.findOrFail(id);
        this.requireBorrador(tipo);
        const seccion = tipo.secciones.find(s => s.id === seccion_id);
        if (!seccion)
            throw new common_1.NotFoundException('Sección no encontrada en este tipo de trámite');
        return this.prisma.seccionTipoTramite.update({
            where: { id: seccion_id },
            data: { titulo: dto.titulo, descripcion: dto.descripcion },
            include: { campos: { orderBy: { orden: 'asc' } } },
        });
    }
    async deleteSeccion(id, seccion_id) {
        const tipo = await this.findOrFail(id);
        this.requireBorrador(tipo);
        const seccion = tipo.secciones.find(s => s.id === seccion_id);
        if (!seccion)
            throw new common_1.NotFoundException('Sección no encontrada en este tipo de trámite');
        if (seccion.campos.length > 0) {
            throw new common_1.BadRequestException('La sección tiene campos. Elimínelos antes de borrar la sección.');
        }
        await this.prisma.seccionTipoTramite.delete({ where: { id: seccion_id } });
        const restantes = tipo.secciones.filter(s => s.id !== seccion_id);
        for (let i = 0; i < restantes.length; i++) {
            await this.prisma.seccionTipoTramite.update({
                where: { id: restantes[i].id },
                data: { orden: i + 1 },
            });
        }
        return { mensaje: 'Sección eliminada correctamente' };
    }
    async reorderSecciones(id, ordenIds) {
        const tipo = await this.findOrFail(id);
        this.requireBorrador(tipo);
        if (ordenIds.length !== tipo.secciones.length) {
            throw new common_1.BadRequestException('La lista debe incluir exactamente todas las secciones del tipo');
        }
        for (const sid of ordenIds) {
            if (!tipo.secciones.find(s => s.id === sid)) {
                throw new common_1.BadRequestException(`Sección ${sid} no pertenece a este tipo de trámite`);
            }
        }
        await this.prisma.$transaction(ordenIds.map((sid, i) => this.prisma.seccionTipoTramite.update({ where: { id: sid }, data: { orden: i + 1 } })));
        return this.findOrFail(id);
    }
    async addCampo(id, seccion_id, dto) {
        const tipo = await this.findOrFail(id);
        this.requireBorrador(tipo);
        const seccion = tipo.secciones.find(s => s.id === seccion_id);
        if (!seccion)
            throw new common_1.NotFoundException('Sección no encontrada en este tipo de trámite');
        const todosLosCampos = tipo.secciones.flatMap(s => s.campos);
        if (todosLosCampos.some(c => c.nombre === dto.nombre)) {
            throw new common_1.ConflictException(`Ya existe un campo con el nombre "${dto.nombre}" en este tipo de trámite`);
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
                valor_defecto: dto.valor_defecto,
                opciones: dto.opciones,
                validaciones: dto.validaciones,
                orden: seccion.campos.length + 1,
            },
        });
    }
    async updateCampo(id, seccion_id, campo_id, dto) {
        const tipo = await this.findOrFail(id);
        this.requireBorrador(tipo);
        const seccion = tipo.secciones.find(s => s.id === seccion_id);
        if (!seccion)
            throw new common_1.NotFoundException('Sección no encontrada en este tipo de trámite');
        const campo = seccion.campos.find(c => c.id === campo_id);
        if (!campo)
            throw new common_1.NotFoundException('Campo no encontrado en esta sección');
        if (dto.nombre && dto.nombre !== campo.nombre) {
            const todosLosCampos = tipo.secciones.flatMap(s => s.campos);
            if (todosLosCampos.some(c => c.nombre === dto.nombre && c.id !== campo_id)) {
                throw new common_1.ConflictException(`Ya existe un campo con el nombre "${dto.nombre}"`);
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
                valor_defecto: dto.valor_defecto,
                opciones: dto.opciones,
                validaciones: dto.validaciones,
            },
        });
    }
    async deleteCampo(id, seccion_id, campo_id) {
        const tipo = await this.findOrFail(id);
        this.requireBorrador(tipo);
        const seccion = tipo.secciones.find(s => s.id === seccion_id);
        if (!seccion)
            throw new common_1.NotFoundException('Sección no encontrada en este tipo de trámite');
        const campo = seccion.campos.find(c => c.id === campo_id);
        if (!campo)
            throw new common_1.NotFoundException('Campo no encontrado en esta sección');
        await this.prisma.campoSeccionTipoTramite.delete({ where: { id: campo_id } });
        const restantes = seccion.campos.filter(c => c.id !== campo_id);
        for (let i = 0; i < restantes.length; i++) {
            await this.prisma.campoSeccionTipoTramite.update({
                where: { id: restantes[i].id },
                data: { orden: i + 1 },
            });
        }
        return { mensaje: `Campo "${campo.nombre}" eliminado correctamente` };
    }
    async reorderCampos(id, seccion_id, ordenIds) {
        const tipo = await this.findOrFail(id);
        this.requireBorrador(tipo);
        const seccion = tipo.secciones.find(s => s.id === seccion_id);
        if (!seccion)
            throw new common_1.NotFoundException('Sección no encontrada en este tipo de trámite');
        if (ordenIds.length !== seccion.campos.length) {
            throw new common_1.BadRequestException('La lista debe incluir exactamente todos los campos de la sección');
        }
        for (const cid of ordenIds) {
            if (!seccion.campos.find(c => c.id === cid)) {
                throw new common_1.BadRequestException(`Campo ${cid} no pertenece a esta sección`);
            }
        }
        await this.prisma.$transaction(ordenIds.map((cid, i) => this.prisma.campoSeccionTipoTramite.update({ where: { id: cid }, data: { orden: i + 1 } })));
        return this.findOrFail(id);
    }
};
exports.TiposTramiteService = TiposTramiteService;
exports.TiposTramiteService = TiposTramiteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TiposTramiteService);
//# sourceMappingURL=tipos-tramite.service.js.map