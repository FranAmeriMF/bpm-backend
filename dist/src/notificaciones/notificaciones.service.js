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
exports.NotificacionesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const paginate_helper_1 = require("../common/helpers/paginate.helper");
let NotificacionesService = class NotificacionesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUsuario(usuario_id, query) {
        const { page = 1, limit = 20, leida, tipo } = query;
        const { skip, take } = (0, paginate_helper_1.paginationParams)(page, limit);
        const where = { usuario_id };
        if (leida !== undefined)
            where.leida = leida;
        if (tipo)
            where.tipo = tipo;
        const [data, total] = await Promise.all([
            this.prisma.notificacion.findMany({
                where, skip, take,
                orderBy: { fecha_creacion: 'desc' },
                include: { tramite: { select: { id: true, numero: true } } },
            }),
            this.prisma.notificacion.count({ where }),
        ]);
        return (0, paginate_helper_1.paginar)(data, total, page, limit);
    }
    async countNoLeidas(usuario_id) {
        const count = await this.prisma.notificacion.count({ where: { usuario_id, leida: false } });
        return { no_leidas: count };
    }
    async marcarLeida(id) {
        const notif = await this.prisma.notificacion.findUnique({ where: { id } });
        if (!notif)
            throw new common_1.NotFoundException('Notificación no encontrada');
        return this.prisma.notificacion.update({
            where: { id },
            data: { leida: true, fecha_lectura: new Date() },
        });
    }
    async marcarTodasLeidas(usuario_id) {
        await this.prisma.notificacion.updateMany({
            where: { usuario_id, leida: false },
            data: { leida: true, fecha_lectura: new Date() },
        });
        return { mensaje: 'Todas las notificaciones marcadas como leídas' };
    }
    async remove(id) {
        const notif = await this.prisma.notificacion.findUnique({ where: { id } });
        if (!notif)
            throw new common_1.NotFoundException('Notificación no encontrada');
        return this.prisma.notificacion.delete({ where: { id } });
    }
};
exports.NotificacionesService = NotificacionesService;
exports.NotificacionesService = NotificacionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificacionesService);
//# sourceMappingURL=notificaciones.service.js.map