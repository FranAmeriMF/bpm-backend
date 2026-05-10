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
exports.NotificacionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notificaciones_service_1 = require("./notificaciones.service");
const query_notificaciones_dto_1 = require("./dto/query-notificaciones.dto");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let NotificacionesController = class NotificacionesController {
    notificacionesService;
    constructor(notificacionesService) {
        this.notificacionesService = notificacionesService;
    }
    findAll(user, query) {
        return this.notificacionesService.findByUsuario(user.id, query);
    }
    countNoLeidas(user) {
        return this.notificacionesService.countNoLeidas(user.id);
    }
    marcarTodasLeidas(user) {
        return this.notificacionesService.marcarTodasLeidas(user.id);
    }
    marcarLeida(id) {
        return this.notificacionesService.marcarLeida(id);
    }
    remove(id) {
        return this.notificacionesService.remove(id);
    }
};
exports.NotificacionesController = NotificacionesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mis notificaciones [todos]' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_notificaciones_dto_1.QueryNotificacionesDto]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('no-leidas'),
    (0, swagger_1.ApiOperation)({ summary: 'Cantidad de notificaciones no leídas [todos]' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "countNoLeidas", null);
__decorate([
    (0, common_1.Patch)('leer-todas'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar todas como leídas [todos]' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "marcarTodasLeidas", null);
__decorate([
    (0, common_1.Patch)(':id/leer'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar notificación como leída [todos]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "marcarLeida", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar notificación [todos]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "remove", null);
exports.NotificacionesController = NotificacionesController = __decorate([
    (0, swagger_1.ApiTags)('Notificaciones'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('notificaciones'),
    __metadata("design:paramtypes", [notificaciones_service_1.NotificacionesService])
], NotificacionesController);
//# sourceMappingURL=notificaciones.controller.js.map