import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OficinaStatus } from '@prisma/client';

export class CreateOficinaDto {
  @ApiProperty({ example: 'Oficina de Obras', description: 'Nombre de la oficina' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ example: 'Se encarga de los permisos de obra', description: 'Descripción de la oficina' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 'OBRAS', description: 'Código único de la oficina' })
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @ApiPropertyOptional({ enum: OficinaStatus, default: OficinaStatus.activa, description: 'Estado de la oficina' })
  @IsOptional()
  @IsEnum(OficinaStatus)
  estado?: OficinaStatus;

  @ApiPropertyOptional({ example: 'obras@municipio.gob.ar', description: 'Email de la oficina' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: false, description: '¿Esta oficina puede tomar decisiones finales?' })
  @IsOptional()
  @IsBoolean()
  permite_decision_final?: boolean;
}
