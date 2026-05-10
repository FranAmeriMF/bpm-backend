import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { OficinaStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryOficinasDto extends PaginationDto {
  @ApiPropertyOptional({ enum: OficinaStatus })
  @IsOptional()
  @IsEnum(OficinaStatus)
  estado?: OficinaStatus;

  @ApiPropertyOptional({ description: 'Filtrar solo las que pueden tomar decisión final' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : undefined)
  @IsBoolean()
  permite_decision_final?: boolean;

  @ApiPropertyOptional({ description: 'Buscar por nombre o código' })
  @IsOptional()
  @IsString()
  buscar?: string;
}
