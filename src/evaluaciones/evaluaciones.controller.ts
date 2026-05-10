import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EvaluacionesService } from './evaluaciones.service';
import { EvaluarSeccionDto } from './dto/evaluar-seccion.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Evaluaciones')
@ApiBearerAuth('JWT')
@Controller('evaluaciones')
export class EvaluacionesController {
  constructor(private readonly evaluacionesService: EvaluacionesService) {}

  @Post('seccion')
  @Roles('jefe_oficina', 'interno')
  @ApiOperation({ summary: 'Evaluar sección del trámite [jefe_oficina, interno] — crea o actualiza' })
  @ApiResponse({ status: 201, description: 'Sección evaluada.' })
  evaluarSeccion(@Body() dto: EvaluarSeccionDto) {
    return this.evaluacionesService.evaluarSeccion(dto);
  }

  @Get('tramite/:tramite_id')
  @ApiOperation({ summary: 'Evaluaciones de un trámite [todos]' })
  @ApiParam({ name: 'tramite_id' })
  getByTramite(@Param('tramite_id') tramite_id: string) {
    return this.evaluacionesService.getEvaluacionesByTramite(tramite_id);
  }

  @Get('asignacion/:asignacion_id/progreso')
  @Roles('jefe_oficina', 'interno', 'moderador', 'admin')
  @ApiOperation({ summary: 'Progreso de una asignación [jefe_oficina, interno, moderador, admin]' })
  @ApiParam({ name: 'asignacion_id' })
  getProgreso(@Param('asignacion_id') asignacion_id: string) {
    return this.evaluacionesService.getProgreso(asignacion_id);
  }

  @Put(':id')
  @Roles('jefe_oficina', 'interno')
  @ApiOperation({ summary: 'Actualizar evaluación existente [jefe_oficina, interno]' })
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() dto: EvaluarSeccionDto) {
    return this.evaluacionesService.updateEvaluacion(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener evaluación por ID [todos]' })
  findOne(@Param('id') id: string) {
    return this.evaluacionesService.getEvaluacionById(id);
  }
}
