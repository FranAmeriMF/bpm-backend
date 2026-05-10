import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { TramitesService } from './tramites.service';
import { ArchivosService } from '../archivos/archivos.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { RechazarDirectorDto } from './dto/rechazar-director.dto';
import { AsignarTramiteDto } from './dto/asignar-tramite.dto';
import { DecisionFinalDto } from './dto/decision-final.dto';
import { ReenviarTramiteDto } from './dto/reenviar-tramite.dto';
import { QueryTramitesDto } from './dto/query-tramites.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Trámites')
@ApiBearerAuth('JWT')
@Controller('tramites')
export class TramitesController {
  constructor(
    private readonly tramitesService: TramitesService,
    private readonly archivosService: ArchivosService,
  ) {}

  // ─── CRUD Base ────────────────────────────────────────────────────────────

  @Post()
  @Roles('solicitante', 'admin')
  @ApiOperation({ summary: 'Crear trámite en borrador [solicitante, admin] — número se genera automáticamente' })
  @ApiResponse({ status: 201, description: 'Trámite creado en estado borrador.' })
  create(@Body() dto: CreateTramiteDto) {
    return this.tramitesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar trámites [todos]' })
  findAll(@Query() query: QueryTramitesDto, @CurrentUser() user: RequestUser) {
    return this.tramitesService.findAll(query, user);
  }

  @Get('estadisticas')
  @ApiOperation({ summary: 'Conteo de trámites agrupado por estado [todos]' })
  getEstadisticas() {
    return this.tramitesService.getEstadisticas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener trámite completo [todos]' })
  findOne(@Param('id') id: string) {
    return this.tramitesService.findOne(id);
  }

  @Get(':id/archivos')
  @ApiOperation({ summary: 'Listar archivos adjuntos de un trámite [todos]' })
  getArchivos(@Param('id') id: string) {
    return this.archivosService.findByTramite(id);
  }

  @Patch(':id')
  @Roles('solicitante', 'admin')
  @ApiOperation({ summary: 'Actualizar datos del formulario [solicitante] — solo en borrador o corrigiendo' })
  update(@Param('id') id: string, @Body() dto: UpdateTramiteDto) {
    return this.tramitesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('solicitante', 'admin')
  @ApiOperation({ summary: 'Eliminar trámite [solicitante, admin] — solo en borrador' })
  remove(@Param('id') id: string) {
    return this.tramitesService.remove(id);
  }

  // ─── Workflow ─────────────────────────────────────────────────────────────

  @Post(':id/enviar-director')
  @Roles('solicitante')
  @ApiOperation({ summary: 'Solicitante envía al director para revisión interna [solicitante]' })
  @ApiParam({ name: 'id', description: 'ID del trámite' })
  @ApiResponse({ status: 200, description: 'Estado → en_revision_interna' })
  enviarDirector(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.tramitesService.enviarDirector(id, user.id);
  }

  @Post(':id/aprobar-director')
  @Roles('director')
  @ApiOperation({ summary: 'Director aprueba internamente [director]' })
  @ApiParam({ name: 'id', description: 'ID del trámite' })
  @ApiResponse({ status: 200, description: 'Estado → pendiente_asignacion' })
  aprobarDirector(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.tramitesService.aprobarDirector(id, user.id);
  }

  @Post(':id/rechazar-director')
  @Roles('director')
  @ApiOperation({ summary: 'Director rechaza y devuelve al solicitante [director]' })
  @ApiParam({ name: 'id', description: 'ID del trámite' })
  @ApiResponse({ status: 200, description: 'Estado → borrador (con observaciones)' })
  rechazarDirector(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: RechazarDirectorDto,
  ) {
    return this.tramitesService.rechazarDirector(id, user.id, dto.observaciones);
  }

  @Post(':id/asignar')
  @Roles('moderador')
  @ApiOperation({ summary: 'Moderador asigna el trámite a oficinas [moderador]' })
  @ApiParam({ name: 'id', description: 'ID del trámite' })
  @ApiResponse({ status: 200, description: 'Estado → asignado' })
  asignar(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: AsignarTramiteDto,
  ) {
    return this.tramitesService.asignar(id, dto, user.id);
  }

  @Post(':id/iniciar-revision')
  @Roles('jefe_oficina', 'interno')
  @ApiOperation({ summary: 'Iniciar revisión técnica [jefe_oficina, interno]' })
  @ApiParam({ name: 'id', description: 'ID del trámite' })
  iniciarRevision(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.tramitesService.iniciarRevision(id, user);
  }

  @Post(':id/finalizar-revision')
  @Roles('jefe_oficina', 'interno')
  @ApiOperation({ summary: 'Finalizar revisión [jefe_oficina, interno] — si todas terminan → en_revision_final' })
  @ApiParam({ name: 'id', description: 'ID del trámite' })
  finalizarRevision(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.tramitesService.finalizarRevision(id, user);
  }

  @Post(':id/decision-final')
  @Roles('jefe_oficina')
  @ApiOperation({ summary: 'Decisor toma la decisión final [jefe_oficina con es_decisor=true]' })
  @ApiParam({ name: 'id', description: 'ID del trámite' })
  @ApiResponse({ status: 200, description: 'Estado → aprobado | rechazado | observado' })
  decisionFinal(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: DecisionFinalDto,
  ) {
    return this.tramitesService.decisionFinal(id, dto, user.id);
  }

  @Post(':id/iniciar-correccion')
  @Roles('solicitante')
  @ApiOperation({ summary: 'Solicitante inicia edición de correcciones [solicitante] — desde estado observado → corrigiendo' })
  @ApiParam({ name: 'id', description: 'ID del trámite' })
  @ApiResponse({ status: 200, description: 'Estado → corrigiendo' })
  iniciarCorreccion(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.tramitesService.iniciarCorreccion(id, user.id);
  }

  @Post(':id/reenviar')
  @Roles('solicitante')
  @ApiOperation({ summary: 'Solicitante reenvía con correcciones [solicitante] — desde observado o corrigiendo' })
  @ApiParam({ name: 'id', description: 'ID del trámite' })
  @ApiResponse({ status: 200, description: 'Estado → asignado (nueva ronda de revisión)' })
  reenviar(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: ReenviarTramiteDto,
  ) {
    return this.tramitesService.reenviar(id, user.id, dto.secciones);
  }
}
