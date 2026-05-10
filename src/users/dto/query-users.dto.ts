import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryUsersDto extends PaginationDto {
  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  rol?: UserRole;

  @ApiPropertyOptional({
    enum: ['interno', 'externo'],
    description: 'interno → admin/moderador/jefe_oficina/interno | externo → solicitante/director',
  })
  @IsOptional()
  @IsIn(['interno', 'externo'])
  tipo?: 'interno' | 'externo';

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  estado?: UserStatus;

  @ApiPropertyOptional({ description: 'ID de empresa' })
  @IsOptional()
  @IsString()
  empresa_id?: string;

  @ApiPropertyOptional({ description: 'ID de oficina municipal' })
  @IsOptional()
  @IsString()
  oficina_id?: string;

  @ApiPropertyOptional({ description: 'Buscar por nombre, apellido, email o DNI' })
  @IsOptional()
  @IsString()
  buscar?: string;
}
