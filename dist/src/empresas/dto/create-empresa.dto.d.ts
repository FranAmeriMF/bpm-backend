import { EmpresaStatus } from '@prisma/client';
export declare class CreateEmpresaDto {
    razon_social: string;
    nombre_fantasia?: string;
    cuit: string;
    direccion: string;
    telefono?: string;
    email: string;
    estado?: EmpresaStatus;
    director_id?: string;
}
