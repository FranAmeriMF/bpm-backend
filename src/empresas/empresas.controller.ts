import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { EmpresaStatus } from '@prisma/client';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaConDirectorDto } from './dto/create-empresa-con-director.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { QueryEmpresasDto } from './dto/query-empresas.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Empresas')
@ApiBearerAuth('JWT')
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear empresa + director [admin] — crea la empresa y su usuario director en una transacción' })
  @ApiResponse({ status: 201, description: 'Empresa y usuario director creados. Se envía email con contraseña temporal al director.' })
  create(@Body() dto: CreateEmpresaConDirectorDto) {
    return this.empresasService.create(dto);
  }

  @Get()
  @Roles('admin', 'moderador')
  @ApiOperation({ summary: 'Listar empresas [admin, moderador]' })
  findAll(@Query() query: QueryEmpresasDto) {
    return this.empresasService.findAll(query);
  }

  @Get(':id')
  @Roles('admin', 'director', 'moderador')
  @ApiOperation({ summary: 'Obtener empresa [admin, director, moderador]' })
  findOne(@Param('id') id: string) {
    return this.empresasService.findOne(id);
  }

  @Get(':id/estadisticas')
  @Roles('admin', 'director')
  @ApiOperation({ summary: 'Estadísticas de trámites y usuarios de una empresa [admin, director]' })
  getEstadisticas(@Param('id') id: string) {
    return this.empresasService.getEstadisticas(id);
  }

  @Get(':id/usuarios')
  @Roles('admin', 'director')
  @ApiOperation({ summary: 'Usuarios de una empresa [admin, director]' })
  getUsuarios(@Param('id') id: string) {
    return this.empresasService.getUsuarios(id);
  }

  @Get(':id/tramites')
  @Roles('admin', 'director', 'moderador')
  @ApiOperation({ summary: 'Trámites de una empresa [admin, director, moderador]' })
  @ApiQuery({ name: 'estado', type: String, required: false })
  getTramites(@Param('id') id: string, @Query('estado') estado?: string) {
    return this.empresasService.getTramites(id, estado);
  }

  @Patch(':id')
  @Roles('admin', 'director')
  @ApiOperation({ summary: 'Actualizar empresa [admin, director]' })
  update(@Param('id') id: string, @Body() dto: UpdateEmpresaDto) {
    return this.empresasService.update(id, dto);
  }

  @Patch(':id/estado')
  @Roles('admin')
  @ApiOperation({ summary: 'Cambiar estado de empresa [admin]' })
  @ApiQuery({ name: 'estado', enum: EmpresaStatus, required: true })
  changeStatus(@Param('id') id: string, @Query('estado') estado: EmpresaStatus) {
    return this.empresasService.changeStatus(id, estado);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar empresa [admin]' })
  remove(@Param('id') id: string) {
    return this.empresasService.remove(id);
  }
}
