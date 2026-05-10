import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { DecisionesService } from './decisiones.service';
import { QueryDecisionesDto } from './dto/query-decisiones.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Decisiones')
@ApiBearerAuth('JWT')
@Roles('jefe_oficina', 'admin')
@Controller('decisiones')
export class DecisionesController {
  constructor(private readonly decisionesService: DecisionesService) {}

  @Get('pendientes')
  @ApiOperation({ summary: 'Trámites listos para decisión final del jefe decisor [jefe_oficina]' })
  getPendientes(@CurrentUser() user: RequestUser, @Query() query: QueryDecisionesDto) {
    return this.decisionesService.getPendientes(user.id, query.page, query.limit);
  }

  @Get('historial')
  @ApiOperation({ summary: 'Historial de decisiones tomadas por el jefe [jefe_oficina]' })
  getHistorial(@CurrentUser() user: RequestUser, @Query() query: QueryDecisionesDto) {
    return this.decisionesService.getHistorial(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de una decisión final [jefe_oficina, admin]' })
  @ApiParam({ name: 'id', description: 'ID de la DecisionFinal' })
  getDetalle(@Param('id') id: string) {
    return this.decisionesService.getDetalle(id);
  }

  @Get(':id/seguimiento')
  @ApiOperation({ summary: 'Seguimiento de un trámite observado [jefe_oficina, admin]' })
  @ApiParam({ name: 'id', description: 'ID de la DecisionFinal' })
  getSeguimiento(@Param('id') id: string) {
    return this.decisionesService.getSeguimiento(id);
  }
}
