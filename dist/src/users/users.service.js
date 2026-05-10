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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const paginate_helper_1 = require("../common/helpers/paginate.helper");
function generarPasswordTemporal() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
let UsersService = class UsersService {
    prisma;
    mail;
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    async create(createUserDto) {
        const existing = await this.prisma.user.findFirst({
            where: { OR: [{ email: createUserDto.email }, { dni: createUserDto.dni }] },
        });
        if (existing)
            throw new common_1.BadRequestException('Ya existe un usuario con ese email o DNI.');
        const passwordTemporal = generarPasswordTemporal();
        const hashedPassword = await bcrypt.hash(passwordTemporal, 10);
        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
                requiere_cambio_password: true,
            },
        });
        void this.mail.enviarBienvenida(user.email, `${user.nombre} ${user.apellido}`, passwordTemporal);
        const { password: _pw, ...userSafe } = user;
        return userSafe;
    }
    async findAll(query) {
        const { page = 1, limit = 20, rol, tipo, estado, empresa_id, oficina_id, buscar } = query;
        const { skip, take } = (0, paginate_helper_1.paginationParams)(page, limit);
        const ROLES_INTERNOS = ['admin', 'moderador', 'jefe_oficina', 'interno'];
        const ROLES_EXTERNOS = ['solicitante', 'director'];
        const where = {};
        if (rol)
            where.rol = rol;
        else if (tipo === 'interno')
            where.rol = { in: ROLES_INTERNOS };
        else if (tipo === 'externo')
            where.rol = { in: ROLES_EXTERNOS };
        if (estado)
            where.estado = estado;
        if (empresa_id)
            where.empresa_id = empresa_id;
        if (oficina_id)
            where.oficina_id = oficina_id;
        if (buscar) {
            where.OR = [
                { nombre: { contains: buscar, mode: 'insensitive' } },
                { apellido: { contains: buscar, mode: 'insensitive' } },
                { email: { contains: buscar, mode: 'insensitive' } },
                { dni: { contains: buscar } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where, skip, take,
                select: {
                    id: true, nombre: true, apellido: true, email: true, dni: true,
                    telefono: true, rol: true, estado: true, cargo: true,
                    empresa_id: true, oficina_id: true,
                    empresa: { select: { id: true, razon_social: true } },
                    oficina: { select: { id: true, nombre: true, codigo: true } },
                    fecha_creacion: true, ultimo_acceso: true, requiere_cambio_password: true,
                },
                orderBy: { fecha_creacion: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return (0, paginate_helper_1.paginar)(data, total, page, limit);
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { empresa: true, oficina: true },
        });
        if (!user)
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        const { password: _pw, ...userSafe } = user;
        return userSafe;
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        return this.prisma.user.update({ where: { id }, data: updateUserDto });
    }
    async assertEmpresaAccess(targetUser, requestUser) {
        if (requestUser.rol !== 'director')
            return;
        const director = await this.prisma.user.findUnique({ where: { id: requestUser.id }, select: { empresa_id: true } });
        if (!director?.empresa_id || director.empresa_id !== targetUser.empresa_id) {
            throw new common_1.ForbiddenException('Solo podés gestionar usuarios de tu propia empresa');
        }
    }
    async changeStatus(id, estado, requestUser) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        if (requestUser)
            await this.assertEmpresaAccess(user, requestUser);
        return this.prisma.user.update({ where: { id }, data: { estado } });
    }
    async resetPassword(id, requestUser) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        if (requestUser)
            await this.assertEmpresaAccess(user, requestUser);
        const passwordTemporal = generarPasswordTemporal();
        const hashedPassword = await bcrypt.hash(passwordTemporal, 10);
        await this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword, requiere_cambio_password: true },
        });
        void this.mail.enviarResetPasswordAdmin(user.email, `${user.nombre} ${user.apellido}`, passwordTemporal);
        return { mensaje: 'Contraseña temporal generada y enviada por email.' };
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], UsersService);
//# sourceMappingURL=users.service.js.map