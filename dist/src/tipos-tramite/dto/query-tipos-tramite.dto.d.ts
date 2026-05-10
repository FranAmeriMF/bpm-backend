import { TipoTramiteStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class QueryTiposTramiteDto extends PaginationDto {
    estado?: TipoTramiteStatus;
    requiere_pago?: boolean;
    buscar?: string;
}
