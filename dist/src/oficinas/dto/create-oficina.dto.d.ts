import { OficinaStatus } from '@prisma/client';
export declare class CreateOficinaDto {
    nombre: string;
    descripcion?: string;
    codigo: string;
    estado?: OficinaStatus;
    email?: string;
    permite_decision_final?: boolean;
}
