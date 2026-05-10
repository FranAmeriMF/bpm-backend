import { UserRole, UserStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class QueryUsersDto extends PaginationDto {
    rol?: UserRole;
    tipo?: 'interno' | 'externo';
    estado?: UserStatus;
    empresa_id?: string;
    oficina_id?: string;
    buscar?: string;
}
