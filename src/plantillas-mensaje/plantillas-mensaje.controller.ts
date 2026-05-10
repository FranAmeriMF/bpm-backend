import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlantillasMensajeService } from './plantillas-mensaje.service';
import { CreatePlantillasMensajeDto } from './dto/create-plantillas-mensaje.dto';
import { UpdatePlantillasMensajeDto } from './dto/update-plantillas-mensaje.dto';
import { QueryPlantillasDto } from './dto/query-plantillas.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Plantillas de Mensaje')
@ApiBearerAuth('JWT')
@Roles('admin', 'jefe_oficina')
@Controller('plantillas-mensaje')
export class PlantillasMensajeController {
  constructor(private readonly plantillasMensajeService: PlantillasMensajeService) {}

  @Post()
  @ApiOperation({ summary: 'Crear plantilla [admin, jefe_oficina]' })
  @ApiResponse({ status: 201, description: 'Creada.' })
  create(@Body() dto: CreatePlantillasMensajeDto) {
    return this.plantillasMensajeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar plantillas [admin, jefe_oficina]' })
  findAll(@Query() query: QueryPlantillasDto) {
    return this.plantillasMensajeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener plantilla [admin, jefe_oficina]' })
  findOne(@Param('id') id: string) {
    return this.plantillasMensajeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar plantilla [admin, jefe_oficina]' })
  update(@Param('id') id: string, @Body() dto: UpdatePlantillasMensajeDto) {
    return this.plantillasMensajeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar plantilla [admin, jefe_oficina]' })
  remove(@Param('id') id: string) {
    return this.plantillasMensajeService.remove(id);
  }
}
