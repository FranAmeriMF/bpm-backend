import { UserRole, UserStatus } from '@prisma/client';
export declare class CreateUserDto {
    nombre: string;
    apellido: string;
    email: string;
    dni: string;
    telefono?: string;
    rol?: UserRole;
    estado?: UserStatus;
    empresa_id?: string;
    oficina_id?: string;
    cargo?: string;
}
