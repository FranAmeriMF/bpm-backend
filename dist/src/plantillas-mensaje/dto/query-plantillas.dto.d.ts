import { DecisionTipo, PlantillaEstado } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class QueryPlantillasDto extends PaginationDto {
    oficina_id?: string;
    tipo_decision?: DecisionTipo;
    estado?: PlantillaEstado;
    buscar?: string;
}
