import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
  @IsNotEmpty()
  @IsString()
  apellido: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Correo electrónico' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', description: 'Documento Nacional de Identidad' })
  @IsNotEmpty()
  @IsString()
  dni: string;

  @ApiPropertyOptional({ example: '+549112345678', description: 'Teléfono de contacto' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.solicitante, description: 'Rol en el sistema' })
  @IsOptional()
  @IsEnum(UserRole)
  rol?: UserRole;

  @ApiPropertyOptional({ enum: UserStatus, default: UserStatus.activo, description: 'Estado de la cuenta' })
  @IsOptional()
  @IsEnum(UserStatus)
  estado?: UserStatus;

  @ApiPropertyOptional({ example: 'uuid', description: 'ID de la empresa a la que pertenece' })
  @IsOptional()
  @IsString()
  empresa_id?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'ID de la oficina (solo jefes)' })
  @IsOptional()
  @IsString()
  oficina_id?: string;

  @ApiPropertyOptional({ example: 'Director de IT', description: 'Cargo del usuario en la empresa u oficina' })
  @IsOptional()
  @IsString()
  cargo?: string;
}
