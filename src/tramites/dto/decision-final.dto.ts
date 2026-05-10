import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DecisionTipo } from '@prisma/client';

export class DecisionFinalDto {
  @ApiProperty({ enum: DecisionTipo, example: DecisionTipo.aprobado, description: 'Decisión tomada' })
  @IsEnum(DecisionTipo)
  @IsNotEmpty()
  decision!: DecisionTipo;

  @ApiPropertyOptional({ example: [1, 3], description: 'Secciones a corregir (solo si decision = observado)' })
  @IsArray()
  @IsOptional()
  secciones_a_corregir?: number[];

  @ApiProperty({ example: 'Estimado solicitante, su trámite ha sido aprobado...', description: 'Mensaje al solicitante' })
  @IsNotEmpty()
  @IsString()
  mensaje_al_solicitante!: string;

  @ApiPropertyOptional({ example: 'uuid-plantilla', description: 'ID de la plantilla usada (opcional)' })
  @IsUUID()
  @IsOptional()
  plantilla_usada_id?: string;
}
