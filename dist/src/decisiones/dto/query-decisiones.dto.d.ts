import { DecisionTipo } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class QueryDecisionesDto extends PaginationDto {
    decision?: DecisionTipo;
    fecha_desde?: string;
    fecha_hasta?: string;
}
