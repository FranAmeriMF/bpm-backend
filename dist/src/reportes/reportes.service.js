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
exports.ReportesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportesService = class ReportesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const [totalTramites, porEstado, totalEmpresas, totalUsuarios] = await Promise.all([
            this.prisma.tramite.count(),
            this.prisma.tramite.groupBy({ by: ['estado'], _count: { id: true } }),
            this.prisma.empresa.count({ where: { estado: 'activa' } }),
            this.prisma.user.count({ where: { estado: 'activo' } }),
        ]);
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - 7);
        const nuevosEstaSemana = await this.prisma.tramite.count({
            where: { fecha_creacion: { gte: inicioSemana } },
        });
        return {
            total_tramites: totalTramites,
            nuevos_esta_semana: nuevosEstaSemana,
            total_empresas_activas: totalEmpresas,
            total_usuarios_activos: totalUsuarios,
            por_estado: porEstado.map((e) => ({ estado: e.estado, cantidad: e._count.id })),
        };
    }
    async getTramitesPorEstado(fecha_desde, fecha_hasta) {
        const where = {};
        if (fecha_desde ?? fecha_hasta) {
            where.fecha_creacion = {};
            if (fecha_desde)
                where.fecha_creacion.gte = new Date(fecha_desde);
            if (fecha_hasta)
                where.fecha_creacion.lte = new Date(fecha_hasta);
        }
        return this.prisma.tramite.groupBy({
            by: ['estado'],
            where,
            _count: { id: true },
        });
    }
    async getDesempenoOficinas() {
        const oficinas = await this.prisma.oficina.findMany({
            include: {
                asignaciones: {
                    include: { evaluaciones_secciones: true },
                },
            },
        });
        return oficinas.map((o) => {
            const total = o.asignaciones.length;
            const completadas = o.asignaciones.filter((a) => a.estado === 'completada').length;
            const tiempos = o.asignaciones
                .filter((a) => a.fecha_inicio_revision !== null && a.fecha_finalizacion !== null)
                .map((a) => {
                const inicio = a.fecha_inicio_revision ? new Date(a.fecha_inicio_revision).getTime() : 0;
                const fin = a.fecha_finalizacion ? new Date(a.fecha_finalizacion).getTime() : 0;
                return (fin - inicio) / (1000 * 60 * 60);
            });
            const tiempoPromedio = tiempos.length > 0
                ? (tiempos.reduce((s, v) => s + v, 0) / tiempos.length).toFixed(1)
                : null;
            return {
                oficina_id: o.id,
                nombre: o.nombre,
                total_asignaciones: total,
                completadas,
                pendientes: total - completadas,
                tiempo_promedio_horas: tiempoPromedio,
            };
        });
    }
    async getDesempenoDecisor(jefe_id) {
        const decisiones = await this.prisma.decisionFinal.findMany({
            where: { jefe_decisor_id: jefe_id },
        });
        const total = decisiones.length;
        if (total === 0)
            return { total: 0, aprobados: 0, rechazados: 0, observados: 0, tasa_aprobacion: '0%' };
        const aprobados = decisiones.filter((d) => d.decision === 'aprobado').length;
        const rechazados = decisiones.filter((d) => d.decision === 'rechazado').length;
        const observados = decisiones.filter((d) => d.decision === 'observado').length;
        return {
            total,
            aprobados,
            rechazados,
            observados,
            tasa_aprobacion: `${((aprobados / total) * 100).toFixed(1)}%`,
        };
    }
    async getReporteEmpresa(empresa_id) {
        const tramites = await this.prisma.tramite.findMany({
            where: { empresa_id },
            include: { tipo_tramite: { select: { nombre: true } }, decision_final: true },
            orderBy: { fecha_creacion: 'desc' },
        });
        const porEstado = tramites.reduce((acc, t) => {
            acc[t.estado] = (acc[t.estado] ?? 0) + 1;
            return acc;
        }, {});
        return { empresa_id, total: tramites.length, por_estado: porEstado, tramites };
    }
};
exports.ReportesService = ReportesService;
exports.ReportesService = ReportesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportesService);
//# sourceMappingURL=reportes.service.js.map