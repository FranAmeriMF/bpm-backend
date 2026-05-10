import { EmpresaStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class QueryEmpresasDto extends PaginationDto {
    estado?: EmpresaStatus;
    buscar?: string;
}
