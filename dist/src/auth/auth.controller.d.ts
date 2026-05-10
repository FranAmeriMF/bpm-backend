import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import type { RequestUser } from './decorators/current-user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
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
    getMe(user: RequestUser): Promise<{
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
    updateMe(dto: UpdateMeDto, user: RequestUser): Promise<{
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
    refresh(user: RequestUser): {
        access_token: string;
    };
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        mensaje: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        mensaje: string;
    }>;
    changePassword(dto: ChangePasswordDto, user: RequestUser): Promise<{
        mensaje: string;
    }>;
}
