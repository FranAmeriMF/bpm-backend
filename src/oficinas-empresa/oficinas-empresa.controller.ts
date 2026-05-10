import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { OficinasEmpresaService } from './oficinas-empresa.service';
import { CreateOficinaEmpresaDto } from './dto/create-oficina-empresa.dto';
import { UpdateOficinaEmpresaDto } from './dto/update-oficina-empresa.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Oficinas de Empresa')
@ApiBearerAuth('JWT')
@Controller('empresas/:empresa_id/oficinas')
export class OficinasEmpresaController {
  constructor(private readonly service: OficinasEmpresaService) {}

  @Post()
  @Roles('director', 'admin')
  @ApiOperation({ summary: 'Crear oficina/sucursal de la empresa [director, admin]' })
  create(
    @Param('empresa_id') empresa_id: string,
    @Body() dto: CreateOficinaEmpresaDto,
  ) {
    return this.service.create(empresa_id, dto);
  }

  @Get()
  @Roles('director', 'admin', 'moderador')
  @ApiOperation({ summary: 'Listar oficinas de la empresa [director, admin, moderador]' })
  findAll(@Param('empresa_id') empresa_id: string) {
    return this.service.findAll(empresa_id);
  }

  @Get(':id')
  @Roles('director', 'admin')
  @ApiOperation({ summary: 'Detalle de oficina [director, admin]' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('director', 'admin')
  @ApiOperation({ summary: 'Actualizar oficina [director, admin]' })
  update(@Param('id') id: string, @Body() dto: UpdateOficinaEmpresaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('director', 'admin')
  @ApiOperation({ summary: 'Eliminar oficina [director, admin]' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/usuarios/:usuario_id')
  @Roles('director', 'admin')
  @ApiOperation({ summary: 'Asignar usuario solicitante a esta oficina [director, admin]' })
  @ApiParam({ name: 'id', description: 'ID de la oficina de empresa' })
  @ApiParam({ name: 'usuario_id', description: 'ID del usuario solicitante' })
  asignarUsuario(
    @Param('id') id: string,
    @Param('usuario_id') usuario_id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.asignarUsuario(id, usuario_id, user.id);
  }

  @Delete(':id/usuarios/:usuario_id')
  @Roles('director', 'admin')
  @ApiOperation({ summary: 'Quitar usuario de esta oficina [director, admin]' })
  desasignarUsuario(
    @Param('id') id: string,
    @Param('usuario_id') usuario_id: string,
  ) {
    return this.service.desasignarUsuario(id, usuario_id);
  }
}
