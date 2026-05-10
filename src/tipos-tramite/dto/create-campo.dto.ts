import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray, IsBoolean, IsEnum, IsNotEmpty, IsObject,
  IsOptional, IsString, Matches, MaxLength,
} from 'class-validator';

export enum TipoCampo {
  text           = 'text',
  textarea       = 'textarea',
  number         = 'number',
  date           = 'date',
  select         = 'select',
  checkbox_group = 'checkbox_group',
  radio          = 'radio',
  file           = 'file',
  checkbox       = 'checkbox',
}

export class CreateCampoDto {
  @ApiProperty({ example: 'nombre_solicitante', description: 'Nombre interno único (solo letras, números, guiones bajos)' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z][a-z0-9_]*$/, { message: 'nombre debe usar solo minúsculas, números y guiones bajos, empezando con letra' })
  @MaxLength(80)
  nombre: string;

  @ApiProperty({ example: 'Nombre del solicitante', description: 'Etiqueta visible para el usuario' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  etiqueta: string;

  @ApiProperty({ enum: TipoCampo, description: 'Tipo de campo del formulario' })
  @IsEnum(TipoCampo)
  tipo: TipoCampo;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  obligatorio?: boolean;

  @ApiPropertyOptional({ example: 'Ingrese su nombre...', description: 'Texto de ejemplo dentro del campo' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  placeholder?: string;

  @ApiPropertyOptional({ description: 'Texto de ayuda mostrado debajo del campo' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Valor por defecto del campo' })
  @IsOptional()
  valor_defecto?: any;

  @ApiPropertyOptional({
    type: [String],
    description: 'Opciones para campos select, checkbox_group y radio',
    example: ['Opción A', 'Opción B'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  opciones?: string[];

  @ApiPropertyOptional({
    description: 'Validaciones específicas del campo',
    example: { min_length: 2, max_length: 50 },
  })
  @IsOptional()
  @IsObject()
  validaciones?: {
    min_length?: number;
    max_length?: number;
    min?: number;
    max?: number;
    permitir_decimales?: boolean;
    formato_moneda?: boolean;
    tipos_archivo?: string[];
    multiples_archivos?: boolean;
    min_seleccionados?: number;
    max_seleccionados?: number;
  };
}
