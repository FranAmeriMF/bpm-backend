import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear usuario [admin]' })
  @ApiResponse({ status: 201, description: 'Usuario creado. La contraseña se hashea automáticamente.' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @Roles('admin', 'moderador')
  @ApiOperation({ summary: 'Listar usuarios [admin, moderador]' })
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener usuario por ID [admin]' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar usuario [admin]' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/estado')
  @Roles('admin', 'director')
  @ApiOperation({ summary: 'Cambiar estado del usuario [admin, director]' })
  @ApiQuery({ name: 'estado', enum: UserStatus, required: true })
  changeStatus(
    @Param('id') id: string,
    @Query('estado') estado: UserStatus,
    @CurrentUser() requestUser: RequestUser,
  ) {
    return this.usersService.changeStatus(id, estado, requestUser);
  }

  @Post(':id/reset-password')
  @Roles('admin', 'director')
  @ApiOperation({ summary: 'Resetear contraseña de usuario [admin, director] — genera contraseña temporal y envía email' })
  resetPassword(@Param('id') id: string, @CurrentUser() requestUser: RequestUser) {
    return this.usersService.resetPassword(id, requestUser);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar usuario [admin]' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
