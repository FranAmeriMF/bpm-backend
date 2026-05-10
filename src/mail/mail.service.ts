import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface MailContext {
  nombre_solicitante: string;
  numero_tramite: string;
  tipo_tramite: string;
  empresa: string;
  mensaje?: string;
  observaciones?: string;
  url_tramite?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailer: MailerService) {}

  async enviarAlDirector(to: string, ctx: MailContext) {
    await this.send(to, `Nuevo trámite para revisión: ${ctx.numero_tramite}`, `
      <p>Estimado/a Director/a,</p>
      <p>El solicitante <strong>${ctx.nombre_solicitante}</strong> envió el trámite
      <strong>${ctx.numero_tramite}</strong> — ${ctx.tipo_tramite} para tu revisión interna.</p>
      <p>Empresa: ${ctx.empresa}</p>
      <p><a href="${ctx.url_tramite ?? '#'}">Ver trámite</a></p>
    `);
  }

  async enviarRechazoDirector(to: string, ctx: MailContext) {
    await this.send(to, `Tu trámite ${ctx.numero_tramite} fue devuelto por el director`, `
      <p>Estimado/a ${ctx.nombre_solicitante},</p>
      <p>El director devolvió tu trámite <strong>${ctx.numero_tramite}</strong>
      con las siguientes observaciones:</p>
      <blockquote>${ctx.observaciones ?? ''}</blockquote>
      <p>Ingresá al sistema, corregí las observaciones y volvé a enviarlo.</p>
      <p><a href="${ctx.url_tramite ?? '#'}">Ver trámite</a></p>
    `);
  }

  async enviarAsignacionJefe(to: string, ctx: MailContext) {
    await this.send(to, `Nuevo trámite asignado: ${ctx.numero_tramite}`, `
      <p>Se te asignó el trámite <strong>${ctx.numero_tramite}</strong>
      — ${ctx.tipo_tramite} de la empresa ${ctx.empresa} para revisión técnica.</p>
      <p><a href="${ctx.url_tramite ?? '#'}">Ir al trámite</a></p>
    `);
  }

  async enviarListoParaDecision(to: string, ctx: MailContext) {
    await this.send(to, `Trámite listo para decisión: ${ctx.numero_tramite}`, `
      <p>Todas las oficinas completaron la revisión del trámite
      <strong>${ctx.numero_tramite}</strong> — ${ctx.tipo_tramite}.</p>
      <p>Podés ingresar al sistema para tomar la decisión final.</p>
      <p><a href="${ctx.url_tramite ?? '#'}">Tomar decisión</a></p>
    `);
  }

  async enviarBienvenida(to: string, nombre: string, passwordTemporal: string) {
    await this.send(to, 'Bienvenido/a — Tu cuenta fue creada', `
      <p>Hola <strong>${nombre}</strong>,</p>
      <p>Tu cuenta en el Sistema de Trámites fue creada exitosamente.</p>
      <p>Podés ingresar con las siguientes credenciales:</p>
      <table style="border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px 12px;font-weight:bold">Email:</td><td style="padding:6px 12px">${to}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Contraseña temporal:</td><td style="padding:6px 12px;font-family:monospace;font-size:16px;letter-spacing:2px;background:#f7f7f7;border:1px solid #ddd">&nbsp;${passwordTemporal}&nbsp;</td></tr>
      </table>
      <p style="color:#e53e3e"><strong>Al ingresar por primera vez deberás cambiar tu contraseña.</strong></p>
      <p><a href="http://localhost:5173/login">Ir al sistema</a></p>
    `);
  }

  async enviarResetPasswordAdmin(to: string, nombre: string, passwordTemporal: string) {
    await this.send(to, 'Tu contraseña fue reseteada', `
      <p>Hola <strong>${nombre}</strong>,</p>
      <p>Un administrador generó una nueva contraseña temporal para tu cuenta.</p>
      <p>Podés ingresar con las siguientes credenciales:</p>
      <table style="border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px 12px;font-weight:bold">Email:</td><td style="padding:6px 12px">${to}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Contraseña temporal:</td><td style="padding:6px 12px;font-family:monospace;font-size:16px;letter-spacing:2px;background:#f7f7f7;border:1px solid #ddd">&nbsp;${passwordTemporal}&nbsp;</td></tr>
      </table>
      <p style="color:#e53e3e"><strong>Al ingresar deberás cambiar tu contraseña.</strong></p>
      <p><a href="http://localhost:5173/login">Ir al sistema</a></p>
    `);
  }

  async enviarRecuperacionPassword(to: string, ctx: MailContext) {
    await this.send(to, 'Recuperación de contraseña — Sistema de Trámites', `
      <p>Hola ${ctx.nombre_solicitante},</p>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Hacé clic en el siguiente enlace (válido por 15 minutos):</p>
      <p><a href="${ctx.url_tramite ?? '#'}">Restablecer contraseña</a></p>
      <p>Si no solicitaste este cambio, ignorá este correo.</p>
    `);
  }

  async enviarDecisionFinal(to: string, decision: string, ctx: MailContext) {
    const estadoLabels: Record<string, string> = { aprobado: '✅ APROBADO', rechazado: '❌ RECHAZADO', observado: '⚠️ OBSERVADO' };
    const estadoLabel = estadoLabels[decision] ?? decision.toUpperCase();
    await this.send(to, `Decisión sobre tu trámite ${ctx.numero_tramite}: ${estadoLabel}`, `
      <p>Estimado/a ${ctx.nombre_solicitante},</p>
      <p>Tu trámite <strong>${ctx.numero_tramite}</strong> — ${ctx.tipo_tramite}
      fue <strong>${estadoLabel}</strong>.</p>
      ${ctx.mensaje ? `<p>${ctx.mensaje}</p>` : ''}
      <p><a href="${ctx.url_tramite ?? '#'}">Ver detalle</a></p>
    `);
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.mailer.sendMail({ to, subject, html });
      this.logger.log(`Email enviado a ${to}: ${subject}`);
    } catch (err) {
      // No fallar el flujo principal si el email falla
      this.logger.error(`Error al enviar email a ${to}: ${(err as Error).message}`);
    }
  }
}
