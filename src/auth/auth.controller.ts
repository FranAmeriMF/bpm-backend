import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { RequestUser } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión — retorna JWT' })
  @ApiResponse({ status: 200, description: 'Login exitoso. Copia el access_token y pegalo en Authorize 🔒' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @ApiBearerAuth('JWT')
  @Get('me')
  @ApiOperation({ summary: 'Obtener datos del usuario actualmente autenticado' })
  getMe(@CurrentUser() user: RequestUser) {
    return this.authService.getMe(user.id);
  }

  @ApiBearerAuth('JWT')
  @Patch('me')
  @ApiOperation({ summary: 'Actualizar perfil propio (nombre, apellido, teléfono, cargo)' })
  updateMe(@Body() dto: UpdateMeDto, @CurrentUser() user: RequestUser) {
    return this.authService.updateMe(user.id, dto);
  }

  @ApiBearerAuth('JWT')
  @Post('refresh')
  @ApiOperation({ summary: 'Renovar JWT — retorna un nuevo token con 8h de vigencia' })
  refresh(@CurrentUser() user: RequestUser) {
    return this.authService.refresh(user.id, user.email, user.rol);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña — envía email con token (15 min)' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña usando el token recibido por email' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.nueva_password);
  }

  @ApiBearerAuth('JWT')
  @Post('change-password')
  @ApiOperation({ summary: 'Cambiar contraseña — obligatorio en el primer ingreso con cuenta nueva' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada. requiere_cambio_password queda en false.' })
  changePassword(@Body() dto: ChangePasswordDto, @CurrentUser() user: RequestUser) {
    return this.authService.changePassword(user.id, dto.password_actual, dto.password_nuevo);
  }
}
