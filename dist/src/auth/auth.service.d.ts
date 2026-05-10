import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { UpdateMeDto } from './dto/update-me.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly mail;
    constructor(prisma: PrismaService, jwtService: JwtService, mail: MailService);
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            nombre: string;
            estado: import("@prisma/client").$Enums.UserStatus;
            email: string;
            fecha_creacion: Date;
            apellido: string;
            dni: string;
            telefono: string | null;
            rol: import("@prisma/client").$Enums.UserRole;
            cargo: string | null;
            requiere_cambio_password: boolean;
            fecha_actualizacion: Date;
            ultimo_acceso: Date | null;
            empresa_id: string | null;
            oficina_id: string | null;
            oficina_empresa_id: string | null;
        };
        requiere_cambio_password: boolean;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        nombre: string;
        estado: import("@prisma/client").$Enums.UserStatus;
        email: string;
        fecha_creacion: Date;
        oficina: {
            id: string;
            nombre: string;
        } | null;
        apellido: string;
        dni: string;
        telefono: string | null;
        rol: import("@prisma/client").$Enums.UserRole;
        cargo: string | null;
        ultimo_acceso: Date | null;
        empresa: {
            id: string;
            razon_social: string;
        } | null;
        empresa_id: string | null;
        oficina_id: string | null;
    }>;
    changePassword(userId: string, passwordActual: string, passwordNuevo: string): Promise<{
        mensaje: string;
    }>;
    refresh(userId: string, email: string, rol: string): {
        access_token: string;
    };
    forgotPassword(email: string): Promise<{
        mensaje: string;
    }>;
    resetPassword(token: string, nuevaPassword: string): Promise<{
        mensaje: string;
    }>;
    updateMe(userId: string, dto: UpdateMeDto): Promise<{
        id: string;
        nombre: string;
        estado: import("@prisma/client").$Enums.UserStatus;
        email: string;
        fecha_creacion: Date;
        oficina: {
            id: string;
            nombre: string;
        } | null;
        apellido: string;
        dni: string;
        telefono: string | null;
        rol: import("@prisma/client").$Enums.UserRole;
        cargo: string | null;
        ultimo_acceso: Date | null;
        empresa: {
            id: string;
            razon_social: string;
        } | null;
        empresa_id: string | null;
        oficina_id: string | null;
    }>;
    hashPassword(password: string): Promise<string>;
}
