"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
let MailService = MailService_1 = class MailService {
    mailer;
    logger = new common_1.Logger(MailService_1.name);
    constructor(mailer) {
        this.mailer = mailer;
    }
    async enviarAlDirector(to, ctx) {
        await this.send(to, `Nuevo trámite para revisión: ${ctx.numero_tramite}`, `
      <p>Estimado/a Director/a,</p>
      <p>El solicitante <strong>${ctx.nombre_solicitante}</strong> envió el trámite
      <strong>${ctx.numero_tramite}</strong> — ${ctx.tipo_tramite} para tu revisión interna.</p>
      <p>Empresa: ${ctx.empresa}</p>
      <p><a href="${ctx.url_tramite ?? '#'}">Ver trámite</a></p>
    `);
    }
    async enviarRechazoDirector(to, ctx) {
        await this.send(to, `Tu trámite ${ctx.numero_tramite} fue devuelto por el director`, `
      <p>Estimado/a ${ctx.nombre_solicitante},</p>
      <p>El director devolvió tu trámite <strong>${ctx.numero_tramite}</strong>
      con las siguientes observaciones:</p>
      <blockquote>${ctx.observaciones ?? ''}</blockquote>
      <p>Ingresá al sistema, corregí las observaciones y volvé a enviarlo.</p>
      <p><a href="${ctx.url_tramite ?? '#'}">Ver trámite</a></p>
    `);
    }
    async enviarAsignacionJefe(to, ctx) {
        await this.send(to, `Nuevo trámite asignado: ${ctx.numero_tramite}`, `
      <p>Se te asignó el trámite <strong>${ctx.numero_tramite}</strong>
      — ${ctx.tipo_tramite} de la empresa ${ctx.empresa} para revisión técnica.</p>
      <p><a href="${ctx.url_tramite ?? '#'}">Ir al trámite</a></p>
    `);
    }
    async enviarListoParaDecision(to, ctx) {
        await this.send(to, `Trámite listo para decisión: ${ctx.numero_tramite}`, `
      <p>Todas las oficinas completaron la revisión del trámite
      <strong>${ctx.numero_tramite}</strong> — ${ctx.tipo_tramite}.</p>
      <p>Podés ingresar al sistema para tomar la decisión final.</p>
      <p><a href="${ctx.url_tramite ?? '#'}">Tomar decisión</a></p>
    `);
    }
    async enviarBienvenida(to, nombre, passwordTemporal) {
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
    async enviarResetPasswordAdmin(to, nombre, passwordTemporal) {
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
    async enviarRecuperacionPassword(to, ctx) {
        await this.send(to, 'Recuperación de contraseña — Sistema de Trámites', `
      <p>Hola ${ctx.nombre_solicitante},</p>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Hacé clic en el siguiente enlace (válido por 15 minutos):</p>
      <p><a href="${ctx.url_tramite ?? '#'}">Restablecer contraseña</a></p>
      <p>Si no solicitaste este cambio, ignorá este correo.</p>
    `);
    }
    async enviarDecisionFinal(to, decision, ctx) {
        const estadoLabels = { aprobado: '✅ APROBADO', rechazado: '❌ RECHAZADO', observado: '⚠️ OBSERVADO' };
        const estadoLabel = estadoLabels[decision] ?? decision.toUpperCase();
        await this.send(to, `Decisión sobre tu trámite ${ctx.numero_tramite}: ${estadoLabel}`, `
      <p>Estimado/a ${ctx.nombre_solicitante},</p>
      <p>Tu trámite <strong>${ctx.numero_tramite}</strong> — ${ctx.tipo_tramite}
      fue <strong>${estadoLabel}</strong>.</p>
      ${ctx.mensaje ? `<p>${ctx.mensaje}</p>` : ''}
      <p><a href="${ctx.url_tramite ?? '#'}">Ver detalle</a></p>
    `);
    }
    async send(to, subject, html) {
        try {
            await this.mailer.sendMail({ to, subject, html });
            this.logger.log(`Email enviado a ${to}: ${subject}`);
        }
        catch (err) {
            this.logger.error(`Error al enviar email a ${to}: ${err.message}`);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map