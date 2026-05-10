import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmpresaStatus } from '@prisma/client';

export class CreateEmpresaDto {
  @ApiProperty({ example: 'Tech Solutions SRL', description: 'Razón social' })
  @IsNotEmpty()
  @IsString()
  razon_social: string;

  @ApiPropertyOptional({ example: 'TechSol', description: 'Nombre de fantasía' })
  @IsOptional()
  @IsString()
  nombre_fantasia?: string;

  @ApiProperty({ example: '30-12345678-9', description: 'CUIT de la empresa' })
  @IsNotEmpty()
  @IsString()
  cuit: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123', description: 'Dirección física' })
  @IsNotEmpty()
  @IsString()
  direccion: string;

  @ApiPropertyOptional({ example: '+549119876543', description: 'Teléfono de contacto' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'contacto@techsol.com', description: 'Email corporativo' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ enum: EmpresaStatus, default: EmpresaStatus.activa, description: 'Estado de la empresa' })
  @IsOptional()
  @IsEnum(EmpresaStatus)
  estado?: EmpresaStatus;

  @ApiPropertyOptional({ example: 'uuid', description: 'ID del usuario director' })
  @IsOptional()
  @IsString()
  director_id?: string;
}
