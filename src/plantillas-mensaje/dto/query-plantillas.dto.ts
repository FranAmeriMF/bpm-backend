import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DecisionTipo, PlantillaEstado } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryPlantillasDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'ID de la oficina municipal' })
  @IsOptional()
  @IsString()
  oficina_id?: string;

  @ApiPropertyOptional({ enum: DecisionTipo })
  @IsOptional()
  @IsEnum(DecisionTipo)
  tipo_decision?: DecisionTipo;

  @ApiPropertyOptional({ enum: PlantillaEstado })
  @IsOptional()
  @IsEnum(PlantillaEstado)
  estado?: PlantillaEstado;

  @ApiPropertyOptional({ description: 'Buscar por nombre' })
  @IsOptional()
  @IsString()
  buscar?: string;
}
