import { CreateOficinaEmpresaDto } from './create-oficina-empresa.dto';
import { OficinaEmpresaStatus } from '@prisma/client';
declare const UpdateOficinaEmpresaDto_base: import("@nestjs/common").Type<Partial<CreateOficinaEmpresaDto>>;
export declare class UpdateOficinaEmpresaDto extends UpdateOficinaEmpresaDto_base {
    estado?: OficinaEmpresaStatus;
}
export {};
