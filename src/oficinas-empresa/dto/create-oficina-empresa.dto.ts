import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateOficinaEmpresaDto {
  @ApiProperty({ example: 'Sucursal Centro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({ example: 'Oficina principal de atención al cliente' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 'Av. Colón 456, Córdoba' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;

  @ApiPropertyOptional({ example: '+543515551234' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;
}
