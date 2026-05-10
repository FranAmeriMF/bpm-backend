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
exports.PlantillasMensajeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const paginate_helper_1 = require("../common/helpers/paginate.helper");
let PlantillasMensajeService = class PlantillasMensajeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.plantillaMensaje.create({ data: dto });
    }
    async findAll(query) {
        const { page = 1, limit = 20, oficina_id, tipo_decision, estado, buscar } = query;
        const { skip, take } = (0, paginate_helper_1.paginationParams)(page, limit);
        const where = {};
        if (oficina_id)
            where.oficina_id = oficina_id;
        if (tipo_decision)
            where.tipo_decision = tipo_decision;
        if (estado)
            where.estado = estado;
        if (buscar)
            where.nombre = { contains: buscar, mode: 'insensitive' };
        const [data, total] = await Promise.all([
            this.prisma.plantillaMensaje.findMany({
                where, skip, take,
                include: { oficina: { select: { id: true, nombre: true } } },
                orderBy: { nombre: 'asc' },
            }),
            this.prisma.plantillaMensaje.count({ where }),
        ]);
        return (0, paginate_helper_1.paginar)(data, total, page, limit);
    }
    async findOne(id) {
        const plantilla = await this.prisma.plantillaMensaje.findUnique({ where: { id } });
        if (!plantilla)
            throw new common_1.NotFoundException(`Plantilla no encontrada`);
        return plantilla;
    }
    async update(id, dto) {
        const plantilla = await this.prisma.plantillaMensaje.findUnique({ where: { id } });
        if (!plantilla)
            throw new common_1.NotFoundException(`Plantilla no encontrada`);
        return this.prisma.plantillaMensaje.update({ where: { id }, data: dto });
    }
    async remove(id) {
        const plantilla = await this.prisma.plantillaMensaje.findUnique({ where: { id } });
        if (!plantilla)
            throw new common_1.NotFoundException(`Plantilla no encontrada`);
        return this.prisma.plantillaMensaje.delete({ where: { id } });
    }
};
exports.PlantillasMensajeService = PlantillasMensajeService;
exports.PlantillasMensajeService = PlantillasMensajeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlantillasMensajeService);
//# sourceMappingURL=plantillas-mensaje.service.js.map