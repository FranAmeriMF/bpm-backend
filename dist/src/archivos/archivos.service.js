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
exports.ArchivosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ArchivosService = class ArchivosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.archivo.create({ data });
    }
    async findOne(id) {
        const archivo = await this.prisma.archivo.findUnique({ where: { id } });
        if (!archivo)
            throw new common_1.NotFoundException(`Archivo con ID ${id} no encontrado`);
        return archivo;
    }
    findByTramite(tramite_id) {
        return this.prisma.archivo.findMany({
            where: { tramite_id },
            include: { seccion: { select: { id: true, titulo: true, orden: true } } },
            orderBy: [{ seccion: { orden: 'asc' } }, { fecha_subida: 'asc' }],
        });
    }
    async remove(id) {
        const archivo = await this.findOne(id);
        try {
            const fs = await import('node:fs');
            if (fs.existsSync(archivo.ruta))
                fs.unlinkSync(archivo.ruta);
        }
        catch {
        }
        return this.prisma.archivo.delete({ where: { id } });
    }
};
exports.ArchivosService = ArchivosService;
exports.ArchivosService = ArchivosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArchivosService);
//# sourceMappingURL=archivos.service.js.map