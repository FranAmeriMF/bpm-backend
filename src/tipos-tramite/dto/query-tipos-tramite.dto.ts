import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { TipoTramiteStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryTiposTramiteDto extends PaginationDto {
  @ApiPropertyOptional({ enum: TipoTramiteStatus })
  @IsOptional()
  @IsEnum(TipoTramiteStatus)
  estado?: TipoTramiteStatus;

  @ApiPropertyOptional({ description: 'Filtrar por si requiere pago' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : undefined)
  @IsBoolean()
  requiere_pago?: boolean;

  @ApiPropertyOptional({ description: 'Buscar por nombre o código' })
  @IsOptional()
  @IsString()
  buscar?: string;
}
