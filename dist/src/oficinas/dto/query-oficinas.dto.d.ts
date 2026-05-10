import { OficinaStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class QueryOficinasDto extends PaginationDto {
    estado?: OficinaStatus;
    permite_decision_final?: boolean;
    buscar?: string;
}
