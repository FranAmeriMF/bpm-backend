import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { TiposTramiteService } from './tipos-tramite.service';
import { CreateTiposTramiteDto } from './dto/create-tipos-tramite.dto';
import { UpdateTiposTramiteDto } from './dto/update-tipos-tramite.dto';
import { QueryTiposTramiteDto } from './dto/query-tipos-tramite.dto';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';
import { CreateCampoDto } from './dto/create-campo.dto';
import { UpdateCampoDto } from './dto/update-campo.dto';
import { SetModoAsignacionDto } from './dto/set-modo-asignacion.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Tipos de Trámite')
@ApiBearerAuth('JWT')
@Controller('tipos-tramite')
export class TiposTramiteController {
  constructor(private readonly tiposTramiteService: TiposTramiteService) {}

  // ─── CRUD Base ────────────────────────────────────────────────────────────

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear tipo de trámite [admin] — inicia en estado borrador' })
  @ApiResponse({ status: 201, description: 'Creado con estado borrador.' })
  create(@Body() dto: CreateTiposTramiteDto) {
    return this.tiposTramiteService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de trámite [todos]' })
  findAll(@Query() query: QueryTiposTramiteDto) {
    return this.tiposTramiteService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tipo de trámite con formulario completo [todos]' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.tiposTramiteService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar datos básicos del tipo de trámite [admin]' })
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() dto: UpdateTiposTramiteDto) {
    return this.tiposTramiteService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar tipo de trámite [admin]' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.tiposTramiteService.remove(id);
  }

  // ─── Ciclo de vida ────────────────────────────────────────────────────────

  @Post(':id/activar')
  @Roles('admin')
  @ApiOperation({ summary: 'Activar tipo de trámite (borrador → activo) [admin]' })
  @ApiParam({ name: 'id' })
  activar(@Param('id') id: string) {
    return this.tiposTramiteService.activar(id);
  }

  @Post(':id/nueva-version')
  @Roles('admin')
  @ApiOperation({ summary: 'Crear nueva versión borrador a partir de un tipo activo [admin]' })
  @ApiParam({ name: 'id' })
  crearNuevaVersion(@Param('id') id: string) {
    return this.tiposTramiteService.crearNuevaVersion(id);
  }

  // ─── Modo de Asignación ───────────────────────────────────────────────────

  @Patch(':id/asignacion')
  @Roles('admin')
  @ApiOperation({ summary: 'Configurar modo de asignación (automático/manual) [admin]' })
  @ApiParam({ name: 'id' })
  setModoAsignacion(@Param('id') id: string, @Body() dto: SetModoAsignacionDto) {
    return this.tiposTramiteService.setModoAsignacion(id, dto);
  }

  // ─── Secciones ────────────────────────────────────────────────────────────

  @Post(':id/secciones')
  @Roles('admin')
  @ApiOperation({ summary: 'Agregar sección al formulario [admin]' })
  @ApiParam({ name: 'id', description: 'ID del tipo de trámite' })
  addSeccion(@Param('id') id: string, @Body() dto: CreateSeccionDto) {
    return this.tiposTramiteService.addSeccion(id, dto);
  }

  @Patch(':id/secciones/:seccion_id')
  @Roles('admin')
  @ApiOperation({ summary: 'Editar sección [admin]' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'seccion_id' })
  updateSeccion(
    @Param('id') id: string,
    @Param('seccion_id') seccion_id: string,
    @Body() dto: UpdateSeccionDto,
  ) {
    return this.tiposTramiteService.updateSeccion(id, seccion_id, dto);
  }

  @Delete(':id/secciones/:seccion_id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar sección (solo si no tiene campos) [admin]' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'seccion_id' })
  deleteSeccion(@Param('id') id: string, @Param('seccion_id') seccion_id: string) {
    return this.tiposTramiteService.deleteSeccion(id, seccion_id);
  }

  @Patch(':id/secciones/reorder')
  @Roles('admin')
  @ApiOperation({ summary: 'Reordenar secciones [admin] — body: { ids: ["uuid1","uuid2",...] }' })
  @ApiParam({ name: 'id' })
  reorderSecciones(@Param('id') id: string, @Body('ids') ids: string[]) {
    return this.tiposTramiteService.reorderSecciones(id, ids);
  }

  // ─── Campos ───────────────────────────────────────────────────────────────

  @Post(':id/secciones/:seccion_id/campos')
  @Roles('admin')
  @ApiOperation({ summary: 'Agregar campo a una sección [admin]' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'seccion_id' })
  addCampo(
    @Param('id') id: string,
    @Param('seccion_id') seccion_id: string,
    @Body() dto: CreateCampoDto,
  ) {
    return this.tiposTramiteService.addCampo(id, seccion_id, dto);
  }

  @Patch(':id/secciones/:seccion_id/campos/:campo_id')
  @Roles('admin')
  @ApiOperation({ summary: 'Editar campo [admin]' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'seccion_id' })
  @ApiParam({ name: 'campo_id' })
  updateCampo(
    @Param('id') id: string,
    @Param('seccion_id') seccion_id: string,
    @Param('campo_id') campo_id: string,
    @Body() dto: UpdateCampoDto,
  ) {
    return this.tiposTramiteService.updateCampo(id, seccion_id, campo_id, dto);
  }

  @Delete(':id/secciones/:seccion_id/campos/:campo_id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar campo [admin]' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'seccion_id' })
  @ApiParam({ name: 'campo_id' })
  deleteCampo(
    @Param('id') id: string,
    @Param('seccion_id') seccion_id: string,
    @Param('campo_id') campo_id: string,
  ) {
    return this.tiposTramiteService.deleteCampo(id, seccion_id, campo_id);
  }

  @Patch(':id/secciones/:seccion_id/campos/reorder')
  @Roles('admin')
  @ApiOperation({ summary: 'Reordenar campos dentro de una sección [admin] — body: { ids: [...] }' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'seccion_id' })
  reorderCampos(
    @Param('id') id: string,
    @Param('seccion_id') seccion_id: string,
    @Body('ids') ids: string[],
  ) {
    return this.tiposTramiteService.reorderCampos(id, seccion_id, ids);
  }
}
