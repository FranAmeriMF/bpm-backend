import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { MailService } from './mail.service';
import { Roles } from '../auth/decorators/roles.decorator';

class TestMailDto {
  @ApiProperty({ example: 'destinatario@gmail.com', description: 'Email donde se enviará el mensaje de prueba' })
  @IsEmail()
  to: string;
}

@ApiTags('Mail')
@ApiBearerAuth('JWT')
@Controller('mail')
export class MailController {
  constructor(private readonly mail: MailService) {}

  @Post('test')
  @Roles('admin')
  @ApiOperation({ summary: 'Enviar email de prueba para verificar configuración SMTP [admin]' })
  async test(@Body() dto: TestMailDto) {
    await this.mail.enviarAlDirector(dto.to, {
      nombre_solicitante: 'Usuario de Prueba',
      numero_tramite: 'TEST-00001',
      tipo_tramite: 'Habilitación Comercial',
      empresa: 'Empresa de Prueba S.A.',
      url_tramite: '/tramites/test-id',
    });
    return { mensaje: `Email de prueba enviado a ${dto.to}` };
  }
}
