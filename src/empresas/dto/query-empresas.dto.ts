import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EmpresaStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryEmpresasDto extends PaginationDto {
  @ApiPropertyOptional({ enum: EmpresaStatus })
  @IsOptional()
  @IsEnum(EmpresaStatus)
  estado?: EmpresaStatus;

  @ApiPropertyOptional({ description: 'Buscar por razón social, nombre fantasía o CUIT' })
  @IsOptional()
  @IsString()
  buscar?: string;
}
