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
exports.EvaluacionesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EvaluacionesService = class EvaluacionesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async evaluarSeccion(dto) {
        if (!dto.aprobada && !dto.motivo_rechazo) {
            throw new common_1.BadRequestException('El motivo de rechazo es obligatorio cuando la sección no es aprobada');
        }
        const asignacion = await this.prisma.asignacionOficina.findUnique({
            where: { id: dto.asignacion_oficina_id },
        });
        if (!asignacion)
            throw new common_1.NotFoundException('Asignación de oficina no encontrada');
        const seccion = await this.prisma.seccionTipoTramite.findUnique({
            where: { id: dto.seccion_id },
        });
        if (!seccion)
            throw new common_1.NotFoundException('Sección no encontrada');
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
    async getEvaluacionesByTramite(tramite_id) {
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
    async getProgreso(asignacion_id) {
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
        if (!asignacion)
            throw new common_1.NotFoundException('Asignación no encontrada');
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
    async updateEvaluacion(id, dto) {
        const ev = await this.prisma.evaluacionSeccion.findUnique({ where: { id } });
        if (!ev)
            throw new common_1.NotFoundException('Evaluación no encontrada');
        if (!dto.aprobada && !dto.motivo_rechazo) {
            throw new common_1.BadRequestException('El motivo de rechazo es obligatorio cuando la sección no es aprobada');
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
    async getEvaluacionById(id) {
        const ev = await this.prisma.evaluacionSeccion.findUnique({
            where: { id },
            include: {
                asignacion_oficina: { include: { oficina: true } },
                seccion: { select: { id: true, titulo: true, orden: true } },
                evaluador: { select: { id: true, nombre: true, apellido: true } },
            },
        });
        if (!ev)
            throw new common_1.NotFoundException('Evaluación no encontrada');
        return ev;
    }
};
exports.EvaluacionesService = EvaluacionesService;
exports.EvaluacionesService = EvaluacionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvaluacionesService);
//# sourceMappingURL=evaluaciones.service.js.map