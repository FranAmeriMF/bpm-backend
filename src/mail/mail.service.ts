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

  // ── Public methods ──────────────────────────────────────────────────────────

  async enviarAlDirector(to: string, ctx: MailContext) {
    const html = this.layout(`
      <p style="${P}">Estimado/a Director/a,</p>
      <p style="${P}">
        El solicitante <strong>${ctx.nombre_solicitante}</strong> presentó el trámite
        <strong style="color:#005C9B">${ctx.numero_tramite}</strong>
        y está esperando tu revisión interna.
      </p>
      ${this.infoRow('Tipo', ctx.tipo_tramite)}
      ${this.infoRow('Empresa', ctx.empresa)}
      ${this.btn(ctx.url_tramite ?? '#', 'Ver trámite')}
    `);
    await this.send(to, `Nuevo trámite para revisión: ${ctx.numero_tramite}`, html);
  }

  async enviarRechazoDirector(to: string, ctx: MailContext) {
    const html = this.layout(`
      <p style="${P}">Estimado/a <strong>${ctx.nombre_solicitante}</strong>,</p>
      <p style="${P}">
        El director devolvió tu trámite
        <strong style="color:#005C9B">${ctx.numero_tramite}</strong>
        con las siguientes observaciones:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0">
        <tr>
          <td style="background:#FFFBEB;border-left:4px solid #D97706;padding:16px 20px;border-radius:0 6px 6px 0;font-size:14px;color:#92400E;line-height:1.7">
            ${ctx.observaciones ?? '—'}
          </td>
        </tr>
      </table>
      <p style="${P}">Ingresá al sistema, corregí las observaciones y volvé a enviarlo.</p>
      ${this.btn(ctx.url_tramite ?? '#', 'Ver trámite')}
    `, { accentColor: '#D97706' });
    await this.send(to, `Tu trámite ${ctx.numero_tramite} fue devuelto por el director`, html);
  }

  async enviarAsignacionJefe(to: string, ctx: MailContext) {
    const html = this.layout(`
      <p style="${P}">Se te asignó un nuevo trámite para revisión técnica.</p>
      ${this.infoRow('Número', ctx.numero_tramite)}
      ${this.infoRow('Tipo', ctx.tipo_tramite)}
      ${this.infoRow('Empresa', ctx.empresa)}
      ${this.btn(ctx.url_tramite ?? '#', 'Ir al trámite')}
    `);
    await this.send(to, `Nuevo trámite asignado: ${ctx.numero_tramite}`, html);
  }

  async enviarListoParaDecision(to: string, ctx: MailContext) {
    const html = this.layout(`
      <p style="${P}">
        Todas las oficinas completaron la revisión del trámite
        <strong style="color:#005C9B">${ctx.numero_tramite}</strong>.
        Podés ingresar al sistema para registrar la decisión final.
      </p>
      ${this.infoRow('Tipo', ctx.tipo_tramite)}
      ${this.infoRow('Empresa', ctx.empresa)}
      ${this.btn(ctx.url_tramite ?? '#', 'Tomar decisión')}
    `);
    await this.send(to, `Trámite listo para decisión: ${ctx.numero_tramite}`, html);
  }

  async enviarBienvenida(to: string, nombre: string, passwordTemporal: string) {
    const html = this.layout(`
      <p style="${P}">Hola <strong>${nombre}</strong>,</p>
      <p style="${P}">Tu cuenta en el Sistema de Trámites fue creada exitosamente. Podés ingresar con las siguientes credenciales:</p>
      ${this.credencialesBlock(to, passwordTemporal)}
      <p style="margin:16px 0 0;font-size:13px;color:#DC2626;font-weight:700">
        Al ingresar por primera vez deberás cambiar tu contraseña.
      </p>
      ${this.btn('http://localhost:5173/login', 'Ir al sistema')}
    `);
    await this.send(to, 'Bienvenido/a — Tu cuenta fue creada', html);
  }

  async enviarResetPasswordAdmin(to: string, nombre: string, passwordTemporal: string) {
    const html = this.layout(`
      <p style="${P}">Hola <strong>${nombre}</strong>,</p>
      <p style="${P}">Un administrador generó una nueva contraseña temporal para tu cuenta:</p>
      ${this.credencialesBlock(to, passwordTemporal)}
      <p style="margin:16px 0 0;font-size:13px;color:#DC2626;font-weight:700">
        Al ingresar deberás cambiar tu contraseña.
      </p>
      ${this.btn('http://localhost:5173/login', 'Ir al sistema')}
    `, { accentColor: '#D97706' });
    await this.send(to, 'Tu contraseña fue reseteada', html);
  }

  async enviarRecuperacionPassword(to: string, ctx: MailContext) {
    const html = this.layout(`
      <p style="${P}">Hola <strong>${ctx.nombre_solicitante}</strong>,</p>
      <p style="${P}">
        Recibimos una solicitud para restablecer tu contraseña.
        El enlace es válido por <strong>15 minutos</strong>.
      </p>
      ${this.btn(ctx.url_tramite ?? '#', 'Restablecer contraseña')}
      <p style="margin:24px 0 0;font-size:12px;color:#9CA3AF">
        Si no solicitaste este cambio, ignorá este correo. Tu contraseña no será modificada.
      </p>
    `);
    await this.send(to, 'Recuperación de contraseña — Sistema de Trámites', html);
  }

  async enviarDecisionFinal(to: string, decision: string, ctx: MailContext) {
    const cfg: Record<string, { label: string; color: string; bg: string; border: string }> = {
      aprobado:  { label: 'APROBADO',  color: '#166534', bg: '#F0FDF4', border: '#16A34A' },
      rechazado: { label: 'RECHAZADO', color: '#991B1B', bg: '#FFF5F5', border: '#DC2626' },
      observado: { label: 'OBSERVADO', color: '#92400E', bg: '#FFFBEB', border: '#D97706' },
    };
    const c = cfg[decision] ?? { label: decision.toUpperCase(), color: '#374151', bg: '#F9FAFB', border: '#6B7280' };

    const html = this.layout(`
      <p style="${P}">Estimado/a <strong>${ctx.nombre_solicitante}</strong>,</p>
      <p style="${P}">
        Se registró una decisión final sobre tu trámite
        <strong style="color:#005C9B">${ctx.numero_tramite}</strong>
        — ${ctx.tipo_tramite}.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0">
        <tr>
          <td bgcolor="${c.bg}" style="background:${c.bg};border:1px solid ${c.border};border-radius:8px;padding:20px 24px;text-align:center">
            <p style="margin:0 0 4px;font-size:12px;color:${c.color};font-weight:700;text-transform:uppercase;letter-spacing:1.5px">Estado final</p>
            <p style="margin:0;font-size:28px;font-weight:800;color:${c.color};letter-spacing:-0.5px">${c.label}</p>
          </td>
        </tr>
      </table>

      ${ctx.mensaje ? `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0">
        <tr>
          <td style="border-left:4px solid ${c.border};padding:16px 20px;background:#F9FAFB;border-radius:0 6px 6px 0;font-size:14px;color:#374151;line-height:1.7">
            ${ctx.mensaje}
          </td>
        </tr>
      </table>
      ` : ''}

      ${this.btn(ctx.url_tramite ?? '#', 'Ver detalle del trámite', c.border)}
    `, { accentColor: c.border });

    await this.send(to, `Decisión sobre tu trámite ${ctx.numero_tramite}: ${c.label}`, html);
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private infoRow(label: string, value: string): string {
    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0">
        <tr>
          <td width="140" style="padding:10px 16px;background:#F0F2F8;color:#6B7280;font-size:13px;font-weight:700;border:1px solid #E0E2EA;border-radius:6px 0 0 6px">
            ${label}
          </td>
          <td style="padding:10px 16px;background:#FFFFFF;font-size:14px;color:#111827;border:1px solid #E0E2EA;border-left:0;border-radius:0 6px 6px 0">
            ${value}
          </td>
        </tr>
      </table>`;
  }

  private credencialesBlock(email: string, password: string): string {
    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;border:1px solid #E0E2EA;border-radius:8px">
        <tr>
          <td width="160" style="padding:14px 16px;background:#F0F2F8;color:#6B7280;font-size:13px;font-weight:700;border-bottom:1px solid #E0E2EA;border-radius:7px 0 0 0">
            Email
          </td>
          <td style="padding:14px 16px;background:#FFFFFF;font-size:14px;color:#111827;border-bottom:1px solid #E0E2EA;border-radius:0 7px 0 0">
            ${email}
          </td>
        </tr>
        <tr>
          <td style="padding:14px 16px;background:#F0F2F8;color:#6B7280;font-size:13px;font-weight:700;border-radius:0 0 0 7px">
            Contraseña temporal
          </td>
          <td style="padding:14px 16px;background:#FFFFFF;font-family:monospace,monospace;font-size:22px;font-weight:700;letter-spacing:4px;color:#005C9B;border-radius:0 0 7px 0">
            ${password}
          </td>
        </tr>
      </table>`;
  }

  private btn(url: string, label: string, color = '#005C9B'): string {
    return `
      <table cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 8px">
        <tr>
          <td bgcolor="${color}" style="background:${color};border-radius:6px">
            <a href="${url}" style="color:#FFFFFF;display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:44px;padding:0 28px;text-decoration:none;border-radius:6px">
              ${label} &rarr;
            </a>
          </td>
        </tr>
      </table>`;
  }

  private layout(content: string, options: { accentColor?: string } = {}): string {
    const accent = options.accentColor ?? '#2E75B6';
    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Sistema de Trámites</title>
</head>
<body style="margin:0;padding:24px 0;background:#EBEDF2;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="padding:0 16px">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr>
          <td bgcolor="#005C9B" style="background:#005C9B;padding:22px 32px;border-radius:8px 8px 0 0">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="color:#FFFFFF;font-size:17px;font-weight:800;letter-spacing:-0.2px">
                  Sistema de Trámites
                </td>
                <td align="right" style="color:rgba(255,255,255,0.55);font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">
                  Municipio
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Accent bar -->
        <tr>
          <td height="4" bgcolor="${accent}" style="background:${accent};height:4px;font-size:0;line-height:0">&nbsp;</td>
        </tr>

        <!-- Body -->
        <tr>
          <td bgcolor="#FFFFFF" style="background:#FFFFFF;padding:32px;border-left:1px solid #DDE0EA;border-right:1px solid #DDE0EA">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td bgcolor="#F4F5F9" style="background:#F4F5F9;padding:16px 32px;border-radius:0 0 8px 8px;border:1px solid #DDE0EA;border-top:0">
            <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6">
              Este es un correo automático del Sistema de Trámites Municipal.<br>
              Por favor no respondas a este mensaje.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.mailer.sendMail({ to, subject, html });
      this.logger.log(`Email enviado a ${to}: ${subject}`);
    } catch (err) {
      this.logger.error(`Error al enviar email a ${to}: ${(err as Error).message}`);
    }
  }
}

// Shorthand para el estilo de párrafo compartido (evita repetir la string en cada template)
const P = 'margin:0 0 14px;font-size:15px;color:#374151;line-height:1.65';
