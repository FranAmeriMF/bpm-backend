import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DecisionTipo, PlantillaEstado } from '@prisma/client';

export class CreatePlantillasMensajeDto {
  @ApiProperty({ example: 'uuid-oficina', description: 'ID de la oficina dueña de la plantilla' })
  @IsNotEmpty()
  @IsString()
  oficina_id: string;

  @ApiProperty({ example: 'Aprobación Estándar', description: 'Nombre interno de la plantilla' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ enum: DecisionTipo, description: 'Tipo de decisión que usa esta plantilla' })
  @IsNotEmpty()
  @IsEnum(DecisionTipo)
  tipo_decision: DecisionTipo;

  @ApiProperty({ example: 'Estimado [NOMBRE_SOLICITANTE]...', description: 'Contenido del mensaje con variables' })
  @IsNotEmpty()
  @IsString()
  contenido: string;

  @ApiPropertyOptional({ enum: PlantillaEstado, default: PlantillaEstado.activa, description: 'Estado de la plantilla' })
  @IsOptional()
  @IsEnum(PlantillaEstado)
  estado?: PlantillaEstado;

  @ApiPropertyOptional({ example: 'uuid-creador', description: 'Usuario creador' })
  @IsOptional()
  @IsString()
  creada_por?: string;
}
