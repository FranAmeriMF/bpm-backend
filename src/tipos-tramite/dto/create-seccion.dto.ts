import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSeccionDto {
  @ApiProperty({ example: 'Datos del Solicitante', description: 'Título de la sección' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  titulo: string;

  @ApiPropertyOptional({ example: 'Complete sus datos personales', description: 'Descripción/instrucciones de la sección' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;
}
