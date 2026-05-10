import { Controller, Get, Patch, Delete, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { NotificacionesService } from './notificaciones.service';
import { QueryNotificacionesDto } from './dto/query-notificaciones.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Notificaciones')
@ApiBearerAuth('JWT')
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Mis notificaciones [todos]' })
  findAll(@CurrentUser() user: RequestUser, @Query() query: QueryNotificacionesDto) {
    return this.notificacionesService.findByUsuario(user.id, query);
  }

  @Get('no-leidas')
  @ApiOperation({ summary: 'Cantidad de notificaciones no leídas [todos]' })
  countNoLeidas(@CurrentUser() user: RequestUser) {
    return this.notificacionesService.countNoLeidas(user.id);
  }

  @Patch('leer-todas')
  @ApiOperation({ summary: 'Marcar todas como leídas [todos]' })
  marcarTodasLeidas(@CurrentUser() user: RequestUser) {
    return this.notificacionesService.marcarTodasLeidas(user.id);
  }

  @Patch(':id/leer')
  @ApiOperation({ summary: 'Marcar notificación como leída [todos]' })
  @ApiParam({ name: 'id' })
  marcarLeida(@Param('id') id: string) {
    return this.notificacionesService.marcarLeida(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar notificación [todos]' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.notificacionesService.remove(id);
  }
}
