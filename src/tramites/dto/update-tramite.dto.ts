import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TramiteSeccionDto } from './tramite-seccion.dto';

export class UpdateTramiteDto {
  @ApiPropertyOptional({ example: 'uuid-oficina-empresa' })
  @IsOptional()
  @IsString()
  oficina_empresa_id?: string;

  @ApiPropertyOptional({
    type: [TramiteSeccionDto],
    description: 'Secciones a actualizar (solo las enviadas se modifican)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TramiteSeccionDto)
  secciones?: TramiteSeccionDto[];
}
