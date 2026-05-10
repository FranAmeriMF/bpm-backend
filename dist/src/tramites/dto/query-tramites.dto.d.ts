import { TramiteEstado } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class QueryTramitesDto extends PaginationDto {
    empresa_id?: string;
    estado?: TramiteEstado;
    tipo_tramite_id?: string;
    solicitante_id?: string;
    oficina_empresa_id?: string;
    numero?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
}
