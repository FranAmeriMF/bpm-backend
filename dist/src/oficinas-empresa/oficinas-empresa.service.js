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
exports.OficinasEmpresaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OficinasEmpresaService = class OficinasEmpresaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(empresa_id, dto) {
        return this.prisma.oficinaEmpresa.create({
            data: { ...dto, empresa_id },
        });
    }
    async findAll(empresa_id) {
        return this.prisma.oficinaEmpresa.findMany({
            where: { empresa_id },
            include: { usuarios: { select: { id: true, nombre: true, apellido: true, email: true, rol: true } } },
            orderBy: { nombre: 'asc' },
        });
    }
    async findOne(id) {
        const oficina = await this.prisma.oficinaEmpresa.findUnique({
            where: { id },
            include: {
                empresa: { select: { id: true, razon_social: true } },
                usuarios: { select: { id: true, nombre: true, apellido: true, email: true, rol: true, estado: true } },
            },
        });
        if (!oficina)
            throw new common_1.NotFoundException('Oficina de empresa no encontrada');
        return oficina;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.oficinaEmpresa.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.oficinaEmpresa.delete({ where: { id } });
    }
    async asignarUsuario(id, usuario_id, director_empresa_id) {
        const oficina = await this.findOne(id);
        const director = await this.prisma.user.findUnique({ where: { id: director_empresa_id } });
        if (director?.empresa_id !== oficina.empresa_id) {
            throw new common_1.ForbiddenException('Solo el director de la empresa puede asignar usuarios a sus oficinas');
        }
        return this.prisma.user.update({
            where: { id: usuario_id },
            data: { oficina_empresa_id: id },
            select: { id: true, nombre: true, apellido: true, email: true, rol: true, oficina_empresa_id: true },
        });
    }
    async desasignarUsuario(id, usuario_id) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id: usuario_id },
            data: { oficina_empresa_id: null },
            select: { id: true, nombre: true, apellido: true, email: true, rol: true },
        });
    }
};
exports.OficinasEmpresaService = OficinasEmpresaService;
exports.OficinasEmpresaService = OficinasEmpresaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OficinasEmpresaService);
//# sourceMappingURL=oficinas-empresa.service.js.map