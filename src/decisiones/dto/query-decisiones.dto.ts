import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DecisionTipo } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryDecisionesDto extends PaginationDto {
  @ApiPropertyOptional({ enum: DecisionTipo })
  @IsOptional()
  @IsEnum(DecisionTipo)
  decision?: DecisionTipo;

  @ApiPropertyOptional({ description: 'Fecha desde (ISO 8601): 2026-01-01' })
  @IsOptional()
  @IsString()
  fecha_desde?: string;

  @ApiPropertyOptional({ description: 'Fecha hasta (ISO 8601): 2026-12-31' })
  @IsOptional()
  @IsString()
  fecha_hasta?: string;
}
