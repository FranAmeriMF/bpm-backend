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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    mail;
    constructor(prisma, jwtService, mail) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mail = mail;
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        if (user.estado !== 'activo') {
            throw new common_1.UnauthorizedException('Tu cuenta está inactiva o suspendida');
        }
        await this.prisma.user.update({ where: { id: user.id }, data: { ultimo_acceso: new Date() } });
        const payload = { sub: user.id, email: user.email, rol: user.rol, oficina_id: user.oficina_id ?? undefined };
        const token = this.jwtService.sign(payload);
        const { password: _pw, ...userSafe } = user;
        return {
            access_token: token,
            user: userSafe,
            requiere_cambio_password: user.requiere_cambio_password,
        };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, nombre: true, apellido: true, email: true,
                dni: true, telefono: true, rol: true, estado: true,
                empresa_id: true, oficina_id: true, cargo: true,
                fecha_creacion: true, ultimo_acceso: true,
                empresa: { select: { id: true, razon_social: true } },
                oficina: { select: { id: true, nombre: true } },
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        return user;
    }
    async changePassword(userId, passwordActual, passwordNuevo) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        const valid = await bcrypt.compare(passwordActual, user.password);
        if (!valid)
            throw new common_1.BadRequestException('La contraseña actual es incorrecta');
        const hashed = await bcrypt.hash(passwordNuevo, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashed, requiere_cambio_password: false },
        });
        return { mensaje: 'Contraseña actualizada correctamente.' };
    }
    refresh(userId, email, rol) {
        const token = this.jwtService.sign({ sub: userId, email, rol });
        return { access_token: token };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { mensaje: 'Si el email existe, recibirás un enlace de recuperación.' };
        const resetToken = this.jwtService.sign({ sub: user.id, purpose: 'reset' }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
        void this.mail.enviarRecuperacionPassword(user.email, {
            nombre_solicitante: `${user.nombre} ${user.apellido}`,
            numero_tramite: '',
            tipo_tramite: '',
            empresa: '',
            url_tramite: `http://localhost:5173/reset-password?token=${resetToken}`,
        });
        return { mensaje: 'Si el email existe, recibirás un enlace de recuperación.' };
    }
    async resetPassword(token, nuevaPassword) {
        let payload;
        try {
            payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
        }
        catch {
            throw new common_1.BadRequestException('Token inválido o expirado');
        }
        if (payload.purpose !== 'reset') {
            throw new common_1.BadRequestException('Token inválido');
        }
        const hashed = await bcrypt.hash(nuevaPassword, 10);
        await this.prisma.user.update({
            where: { id: payload.sub },
            data: { password: hashed },
        });
        return { mensaje: 'Contraseña actualizada correctamente.' };
    }
    async updateMe(userId, dto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: dto,
            select: {
                id: true, nombre: true, apellido: true, email: true,
                dni: true, telefono: true, rol: true, estado: true,
                empresa_id: true, oficina_id: true, cargo: true,
                fecha_creacion: true, ultimo_acceso: true,
                empresa: { select: { id: true, razon_social: true } },
                oficina: { select: { id: true, nombre: true } },
            },
        });
    }
    async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map