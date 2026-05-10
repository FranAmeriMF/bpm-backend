import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { TramiteSeccionDto } from './tramite-seccion.dto';

export class CreateTramiteDto {
  @ApiProperty({ example: 'uuid-empresa' })
  @IsUUID()
  @IsNotEmpty()
  empresa_id!: string;

  @ApiProperty({ example: 'uuid-tipo-tramite' })
  @IsUUID()
  @IsNotEmpty()
  tipo_tramite_id!: string;

  @ApiProperty({ example: 'uuid-usuario' })
  @IsUUID()
  @IsNotEmpty()
  solicitante_id!: string;

  @ApiPropertyOptional({ example: 'uuid-oficina-empresa', description: 'Sucursal/oficina de la empresa' })
  @IsOptional()
  @IsString()
  oficina_empresa_id?: string;

  @ApiPropertyOptional({
    type: [TramiteSeccionDto],
    description: 'Datos del formulario por sección (puede omitirse al crear en borrador)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TramiteSeccionDto)
  secciones?: TramiteSeccionDto[];
}
