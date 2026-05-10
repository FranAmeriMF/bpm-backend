import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ModoAsignacion } from '@prisma/client';

export class SetModoAsignacionDto {
  @ApiProperty({ enum: ModoAsignacion, description: 'Modo de asignación: automático (oficinas preseleccionadas) o manual (moderador asigna caso por caso)' })
  @IsEnum(ModoAsignacion)
  modo_asignacion: ModoAsignacion;

  @ApiPropertyOptional({
    type: [String],
    description: 'IDs de oficinas del sistema para asignación automática (obligatorio si modo = automatico)',
    example: ['uuid-oficina-1', 'uuid-oficina-2'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  oficinas_ids?: string[];
}
