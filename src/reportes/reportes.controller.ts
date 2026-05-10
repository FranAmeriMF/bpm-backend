import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Reportes')
@ApiBearerAuth('JWT')
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('dashboard')
  @Roles('admin', 'moderador')
  @ApiOperation({ summary: 'Dashboard general de trámites [admin, moderador]' })
  getDashboard() {
    return this.reportesService.getDashboard();
  }

  @Get('tramites-por-estado')
  @Roles('admin', 'moderador')
  @ApiOperation({ summary: 'Trámites agrupados por estado [admin, moderador]' })
  @ApiQuery({ name: 'fecha_desde', type: String, required: false })
  @ApiQuery({ name: 'fecha_hasta', type: String, required: false })
  getTramitesPorEstado(
    @Query('fecha_desde') fecha_desde?: string,
    @Query('fecha_hasta') fecha_hasta?: string,
  ) {
    return this.reportesService.getTramitesPorEstado(fecha_desde, fecha_hasta);
  }

  @Get('desempeno-oficinas')
  @Roles('admin')
  @ApiOperation({ summary: 'Desempeño y tiempos promedio por oficina [admin]' })
  getDesempenoOficinas() {
    return this.reportesService.getDesempenoOficinas();
  }

  @Get('desempeno-decisor')
  @Roles('jefe_oficina')
  @ApiOperation({ summary: 'Mis métricas como decisor [jefe_oficina]' })
  getDesempenoDecisor(@CurrentUser() user: RequestUser) {
    return this.reportesService.getDesempenoDecisor(user.id);
  }

  @Get('empresa/:id')
  @Roles('admin', 'director')
  @ApiOperation({ summary: 'Historial de trámites de una empresa [admin, director]' })
  @ApiParam({ name: 'id', description: 'ID de la empresa' })
  getReporteEmpresa(@Param('id') id: string) {
    return this.reportesService.getReporteEmpresa(id);
  }
}
