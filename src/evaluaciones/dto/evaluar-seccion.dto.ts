import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class EvaluarSeccionDto {
  @ApiProperty({ example: 'uuid-asignacion', description: 'ID de la asignación de oficina' })
  @IsUUID()
  @IsNotEmpty()
  asignacion_oficina_id!: string;

  @ApiProperty({ example: 'uuid-seccion', description: 'ID de la sección a evaluar (SeccionTipoTramite)' })
  @IsUUID()
  @IsNotEmpty()
  seccion_id!: string;

  @ApiProperty({ example: true, description: 'Si la sección fue aprobada' })
  @IsBoolean()
  aprobada!: boolean;

  @ApiPropertyOptional({ example: 'Falta el certificado de habilitación vigente', description: 'Motivo de rechazo (obligatorio si aprobada = false)' })
  @IsOptional()
  @IsString()
  motivo_rechazo?: string;

  @ApiProperty({ example: 'uuid-jefe', description: 'ID del jefe evaluador' })
  @IsUUID()
  @IsNotEmpty()
  evaluado_por!: string;
}
