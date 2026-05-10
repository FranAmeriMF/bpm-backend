"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresasService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const paginate_helper_1 = require("../common/helpers/paginate.helper");
function generarPasswordTemporal() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
let EmpresasService = class EmpresasService {
    prisma;
    mail;
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    async create(dto) {
        const { director: directorDto, ...empresaData } = dto;
        const existingUser = await this.prisma.user.findFirst({
            where: { OR: [{ email: directorDto.email }, { dni: directorDto.dni }] },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Ya existe un usuario con ese email o DNI.');
        }
        const passwordTemporal = generarPasswordTemporal();
        const hashedPassword = await bcrypt.hash(passwordTemporal, 10);
        const result = await this.prisma.$transaction(async (tx) => {
            const empresa = await tx.empresa.create({ data: empresaData });
            const director = await tx.user.create({
                data: {
                    ...directorDto,
                    password: hashedPassword,
                    rol: 'director',
                    requiere_cambio_password: true,
                    empresa_id: empresa.id,
                },
            });
            const empresaFinal = await tx.empresa.update({
                where: { id: empresa.id },
                data: { director_id: director.id },
                include: {
                    director: { select: { id: true, nombre: true, apellido: true, email: true } },
                },
            });
            const { password: _pw, ...directorSafe } = director;
            return { empresa: empresaFinal, director: directorSafe };
        });
        void this.mail.enviarBienvenida(directorDto.email, `${directorDto.nombre} ${directorDto.apellido}`, passwordTemporal);
        return result;
    }
    async findAll(query) {
        const { page = 1, limit = 20, estado, buscar } = query;
        const { skip, take } = (0, paginate_helper_1.paginationParams)(page, limit);
        const where = {};
        if (estado)
            where.estado = estado;
        if (buscar) {
            where.OR = [
                { razon_social: { contains: buscar, mode: 'insensitive' } },
                { nombre_fantasia: { contains: buscar, mode: 'insensitive' } },
                { cuit: { contains: buscar } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.empresa.findMany({
                where, skip, take,
                include: { director: { select: { id: true, nombre: true, apellido: true, email: true } } },
                orderBy: { razon_social: 'asc' },
            }),
            this.prisma.empresa.count({ where }),
        ]);
        return (0, paginate_helper_1.paginar)(data, total, page, limit);
    }
    async findOne(id) {
        const empresa = await this.prisma.empresa.findUnique({
            where: { id },
            include: { director: true, usuarios: true, tramites: true },
        });
        if (!empresa)
            throw new common_1.NotFoundException(`Empresa con ID ${id} no encontrada`);
        return empresa;
    }
    async update(id, updateEmpresaDto) {
        const empresa = await this.prisma.empresa.findUnique({ where: { id } });
        if (!empresa)
            throw new common_1.NotFoundException(`Empresa con ID ${id} no encontrada`);
        return this.prisma.empresa.update({ where: { id }, data: updateEmpresaDto });
    }
    async remove(id) {
        const empresa = await this.prisma.empresa.findUnique({ where: { id } });
        if (!empresa)
            throw new common_1.NotFoundException(`Empresa con ID ${id} no encontrada`);
        return this.prisma.empresa.delete({ where: { id } });
    }
    async changeStatus(id, estado) {
        const empresa = await this.prisma.empresa.findUnique({ where: { id } });
        if (!empresa)
            throw new common_1.NotFoundException(`Empresa con ID ${id} no encontrada`);
        return this.prisma.empresa.update({ where: { id }, data: { estado } });
    }
    async getEstadisticas(id) {
        const empresa = await this.prisma.empresa.findUnique({ where: { id } });
        if (!empresa)
            throw new common_1.NotFoundException(`Empresa con ID ${id} no encontrada`);
        const [tramitesGrupo, totalUsuarios] = await Promise.all([
            this.prisma.tramite.groupBy({
                by: ['estado'],
                where: { empresa_id: id },
                _count: { _all: true },
            }),
            this.prisma.user.count({ where: { empresa_id: id } }),
        ]);
        const por_estado = {};
        let totalTramites = 0;
        for (const g of tramitesGrupo) {
            por_estado[g.estado] = g._count._all;
            totalTramites += g._count._all;
        }
        return { total_tramites: totalTramites, total_usuarios: totalUsuarios, por_estado };
    }
    async getUsuarios(id) {
        const empresa = await this.prisma.empresa.findUnique({ where: { id } });
        if (!empresa)
            throw new common_1.NotFoundException(`Empresa con ID ${id} no encontrada`);
        return this.prisma.user.findMany({
            where: { empresa_id: id },
            select: { id: true, nombre: true, apellido: true, email: true, rol: true, estado: true, cargo: true },
        });
    }
    async getTramites(id, estado) {
        const empresa = await this.prisma.empresa.findUnique({ where: { id } });
        if (!empresa)
            throw new common_1.NotFoundException(`Empresa con ID ${id} no encontrada`);
        const where = { empresa_id: id };
        if (estado)
            where.estado = estado;
        return this.prisma.tramite.findMany({
            where,
            include: { tipo_tramite: true, solicitante: { select: { id: true, nombre: true, apellido: true } } },
            orderBy: { fecha_creacion: 'desc' },
        });
    }
};
exports.EmpresasService = EmpresasService;
exports.EmpresasService = EmpresasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], EmpresasService);
//# sourceMappingURL=empresas.service.js.map