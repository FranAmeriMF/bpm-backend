import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested,
} from 'class-validator';

export class NuevoDirectorDto {
  @ApiProperty({ example: 'Juan' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsNotEmpty()
  @IsString()
  apellido: string;

  @ApiProperty({ example: 'director@empresa.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @IsString()
  dni: string;

  @ApiPropertyOptional({ example: '+549112345678' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ example: 'Director General' })
  @IsOptional()
  @IsString()
  cargo?: string;
}

export class CreateEmpresaConDirectorDto {
  @ApiProperty({ example: 'Tech Solutions SRL' })
  @IsNotEmpty()
  @IsString()
  razon_social: string;

  @ApiPropertyOptional({ example: 'TechSol' })
  @IsOptional()
  @IsString()
  nombre_fantasia?: string;

  @ApiProperty({ example: '30-12345678-9' })
  @IsNotEmpty()
  @IsString()
  cuit: string;

  @ApiProperty({ example: 'Av. Siempre Viva 742' })
  @IsNotEmpty()
  @IsString()
  direccion: string;

  @ApiPropertyOptional({ example: '+5491123456789' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'contacto@techsol.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: NuevoDirectorDto, description: 'Datos del director — se crea como usuario con rol director' })
  @ValidateNested()
  @Type(() => NuevoDirectorDto)
  director: NuevoDirectorDto;
}
