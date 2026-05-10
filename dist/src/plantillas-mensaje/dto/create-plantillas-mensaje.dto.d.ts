import { DecisionTipo, PlantillaEstado } from '@prisma/client';
export declare class CreatePlantillasMensajeDto {
    oficina_id: string;
    nombre: string;
    tipo_decision: DecisionTipo;
    contenido: string;
    estado?: PlantillaEstado;
    creada_por?: string;
}
