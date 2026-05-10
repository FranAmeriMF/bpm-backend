import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTiposTramiteDto {
  @ApiProperty({ example: 'Habilitación Comercial', description: 'Nombre del tipo de trámite (único)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'Permite obtener la habilitación para operar un establecimiento comercial en el municipio.', description: 'Descripción del trámite (mín 20 caracteres)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  descripcion: string;

  @ApiProperty({ example: 'HAB_COM', description: 'Código único corto del tipo de trámite' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  codigo: string;
}
