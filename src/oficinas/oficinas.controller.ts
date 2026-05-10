import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OficinasService } from './oficinas.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { QueryOficinasDto } from './dto/query-oficinas.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Oficinas')
@ApiBearerAuth('JWT')
@Controller('oficinas')
export class OficinasController {
  constructor(private readonly oficinasService: OficinasService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear oficina [admin]' })
  @ApiResponse({ status: 201, description: 'Oficina creada.' })
  create(@Body() dto: CreateOficinaDto) {
    return this.oficinasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar oficinas [todos los autenticados]' })
  findAll(@Query() query: QueryOficinasDto) {
    return this.oficinasService.findAll(query);
  }

  @Get(':id')
  @Roles('admin', 'moderador')
  @ApiOperation({ summary: 'Obtener oficina por ID [admin, moderador]' })
  findOne(@Param('id') id: string) {
    return this.oficinasService.findOne(id);
  }

  @Get(':id/jefes')
  @Roles('admin', 'moderador')
  @ApiOperation({ summary: 'Jefes de una oficina [admin, moderador]' })
  getJefes(@Param('id') id: string) {
    return this.oficinasService.getJefes(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar oficina [admin]' })
  update(@Param('id') id: string, @Body() dto: UpdateOficinaDto) {
    return this.oficinasService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar oficina [admin]' })
  remove(@Param('id') id: string) {
    return this.oficinasService.remove(id);
  }
}
