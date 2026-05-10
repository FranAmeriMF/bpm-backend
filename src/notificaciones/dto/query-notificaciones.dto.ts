import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { NotificacionTipo } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryNotificacionesDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'true = solo leídas, false = solo no leídas' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : undefined)
  @IsBoolean()
  leida?: boolean;

  @ApiPropertyOptional({ enum: NotificacionTipo })
  @IsOptional()
  @IsEnum(NotificacionTipo)
  tipo?: NotificacionTipo;
}
