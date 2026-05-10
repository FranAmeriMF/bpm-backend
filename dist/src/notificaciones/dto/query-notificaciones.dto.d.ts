import { NotificacionTipo } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class QueryNotificacionesDto extends PaginationDto {
    leida?: boolean;
    tipo?: NotificacionTipo;
}
