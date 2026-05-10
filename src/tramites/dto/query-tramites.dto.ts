import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TramiteEstado } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryTramitesDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'ID de empresa' })
  @IsOptional()
  @IsString()
  empresa_id?: string;

  @ApiPropertyOptional({ enum: TramiteEstado })
  @IsOptional()
  @IsEnum(TramiteEstado)
  estado?: TramiteEstado;

  @ApiPropertyOptional({ description: 'ID del tipo de trámite' })
  @IsOptional()
  @IsString()
  tipo_tramite_id?: string;

  @ApiPropertyOptional({ description: 'ID del solicitante' })
  @IsOptional()
  @IsString()
  solicitante_id?: string;

  @ApiPropertyOptional({ description: 'ID de oficina de empresa (sucursal)' })
  @IsOptional()
  @IsString()
  oficina_empresa_id?: string;

  @ApiPropertyOptional({ description: 'Buscar por número de trámite' })
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiPropertyOptional({ description: 'Fecha desde (ISO 8601): 2026-01-01' })
  @IsOptional()
  @IsString()
  fecha_desde?: string;

  @ApiPropertyOptional({ description: 'Fecha hasta (ISO 8601): 2026-12-31' })
  @IsOptional()
  @IsString()
  fecha_hasta?: string;
}
