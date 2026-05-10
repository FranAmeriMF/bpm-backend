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
exports.DecisionesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const paginate_helper_1 = require("../common/helpers/paginate.helper");
let DecisionesService = class DecisionesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPendientes(jefe_decisor_id, page = 1, limit = 20) {
        const { skip, take } = (0, paginate_helper_1.paginationParams)(page, limit);
        const where = { estado: 'en_revision_final', jefe_decisor_id };
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
        return (0, paginate_helper_1.paginar)(data, total, page, limit);
    }
    async getHistorial(jefe_decisor_id, query) {
        const { page = 1, limit = 20, decision, fecha_desde, fecha_hasta } = query;
        const { skip, take } = (0, paginate_helper_1.paginationParams)(page, limit);
        const where = { jefe_decisor_id };
        if (decision)
            where.decision = decision;
        if (fecha_desde ?? fecha_hasta) {
            where.fecha_decision = {};
            if (fecha_desde)
                where.fecha_decision.gte = new Date(fecha_desde);
            if (fecha_hasta)
                where.fecha_decision.lte = new Date(fecha_hasta);
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
        return (0, paginate_helper_1.paginar)(data, total, page, limit);
    }
    async getDetalle(id) {
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
        if (!decision)
            throw new common_1.NotFoundException('Decisión no encontrada');
        return decision;
    }
    async getSeguimiento(id) {
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
        if (!decision)
            throw new common_1.NotFoundException('Decisión no encontrada');
        return {
            decision: decision.decision,
            secciones_a_corregir: decision.secciones_a_corregir,
            estado_actual: decision.tramite.estado,
            historial: decision.tramite.historial,
            asignaciones: decision.tramite.asignaciones_oficinas,
        };
    }
};
exports.DecisionesService = DecisionesService;
exports.DecisionesService = DecisionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DecisionesService);
//# sourceMappingURL=decisiones.service.js.map