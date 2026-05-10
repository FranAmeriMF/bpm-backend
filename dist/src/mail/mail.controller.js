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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mail_service_1 = require("./mail.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
class TestMailDto {
    to;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'destinatario@gmail.com', description: 'Email donde se enviará el mensaje de prueba' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], TestMailDto.prototype, "to", void 0);
let MailController = class MailController {
    mail;
    constructor(mail) {
        this.mail = mail;
    }
    async test(dto) {
        await this.mail.enviarAlDirector(dto.to, {
            nombre_solicitante: 'Usuario de Prueba',
            numero_tramite: 'TEST-00001',
            tipo_tramite: 'Habilitación Comercial',
            empresa: 'Empresa de Prueba S.A.',
            url_tramite: '/tramites/test-id',
        });
        return { mensaje: `Email de prueba enviado a ${dto.to}` };
    }
};
exports.MailController = MailController;
__decorate([
    (0, common_1.Post)('test'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar email de prueba para verificar configuración SMTP [admin]' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestMailDto]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "test", null);
exports.MailController = MailController = __decorate([
    (0, swagger_1.ApiTags)('Mail'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('mail'),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailController);
//# sourceMappingURL=mail.controller.js.map