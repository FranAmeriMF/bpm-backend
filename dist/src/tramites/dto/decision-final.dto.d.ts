import { DecisionTipo } from '@prisma/client';
export declare class DecisionFinalDto {
    decision: DecisionTipo;
    secciones_a_corregir?: number[];
    mensaje_al_solicitante: string;
    plantilla_usada_id?: string;
}
