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
export declare class MailService {
    private readonly mailer;
    private readonly logger;
    constructor(mailer: MailerService);
    enviarAlDirector(to: string, ctx: MailContext): Promise<void>;
    enviarRechazoDirector(to: string, ctx: MailContext): Promise<void>;
    enviarAsignacionJefe(to: string, ctx: MailContext): Promise<void>;
    enviarListoParaDecision(to: string, ctx: MailContext): Promise<void>;
    enviarBienvenida(to: string, nombre: string, passwordTemporal: string): Promise<void>;
    enviarResetPasswordAdmin(to: string, nombre: string, passwordTemporal: string): Promise<void>;
    enviarRecuperacionPassword(to: string, ctx: MailContext): Promise<void>;
    enviarDecisionFinal(to: string, decision: string, ctx: MailContext): Promise<void>;
    private send;
}
