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
exports.OficinasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const paginate_helper_1 = require("../common/helpers/paginate.helper");
let OficinasService = class OficinasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOficinaDto) {
        try {
            return await this.prisma.oficina.create({ data: createOficinaDto });
        }
        catch {
            throw new common_1.BadRequestException('No se pudo crear la oficina. Verifique que el código no esté duplicado.');
        }
    }
    async findAll(query) {
        const { page = 1, limit = 20, estado, permite_decision_final, buscar } = query;
        const { skip, take } = (0, paginate_helper_1.paginationParams)(page, limit);
        const where = {};
        if (estado)
            where.estado = estado;
        if (permite_decision_final !== undefined)
            where.permite_decision_final = permite_decision_final;
        if (buscar) {
            where.OR = [
                { nombre: { contains: buscar, mode: 'insensitive' } },
                { codigo: { contains: buscar, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.oficina.findMany({ where, skip, take, orderBy: { nombre: 'asc' } }),
            this.prisma.oficina.count({ where }),
        ]);
        return (0, paginate_helper_1.paginar)(data, total, page, limit);
    }
    async findOne(id) {
        const oficina = await this.prisma.oficina.findUnique({
            where: { id },
            include: { jefes: true },
        });
        if (!oficina)
            throw new common_1.NotFoundException(`Oficina con ID ${id} no encontrada`);
        return oficina;
    }
    async update(id, updateOficinaDto) {
        const oficina = await this.prisma.oficina.findUnique({ where: { id } });
        if (!oficina)
            throw new common_1.NotFoundException(`Oficina con ID ${id} no encontrada`);
        return this.prisma.oficina.update({ where: { id }, data: updateOficinaDto });
    }
    async remove(id) {
        const oficina = await this.prisma.oficina.findUnique({ where: { id } });
        if (!oficina)
            throw new common_1.NotFoundException(`Oficina con ID ${id} no encontrada`);
        return this.prisma.oficina.delete({ where: { id } });
    }
    async getJefes(id) {
        const oficina = await this.prisma.oficina.findUnique({ where: { id } });
        if (!oficina)
            throw new common_1.NotFoundException(`Oficina con ID ${id} no encontrada`);
        return this.prisma.user.findMany({
            where: { oficina_id: id },
            select: { id: true, nombre: true, apellido: true, email: true, rol: true, estado: true, cargo: true },
        });
    }
};
exports.OficinasService = OficinasService;
exports.OficinasService = OficinasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OficinasService);
//# sourceMappingURL=oficinas.service.js.map