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
exports.DecisionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decisiones_service_1 = require("./decisiones.service");
const query_decisiones_dto_1 = require("./dto/query-decisiones.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let DecisionesController = class DecisionesController {
    decisionesService;
    constructor(decisionesService) {
        this.decisionesService = decisionesService;
    }
    getPendientes(user, query) {
        return this.decisionesService.getPendientes(user.id, query.page, query.limit);
    }
    getHistorial(user, query) {
        return this.decisionesService.getHistorial(user.id, query);
    }
    getDetalle(id) {
        return this.decisionesService.getDetalle(id);
    }
    getSeguimiento(id) {
        return this.decisionesService.getSeguimiento(id);
    }
};
exports.DecisionesController = DecisionesController;
__decorate([
    (0, common_1.Get)('pendientes'),
    (0, swagger_1.ApiOperation)({ summary: 'Trámites listos para decisión final del jefe decisor [jefe_oficina]' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_decisiones_dto_1.QueryDecisionesDto]),
    __metadata("design:returntype", void 0)
], DecisionesController.prototype, "getPendientes", null);
__decorate([
    (0, common_1.Get)('historial'),
    (0, swagger_1.ApiOperation)({ summary: 'Historial de decisiones tomadas por el jefe [jefe_oficina]' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_decisiones_dto_1.QueryDecisionesDto]),
    __metadata("design:returntype", void 0)
], DecisionesController.prototype, "getHistorial", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalle de una decisión final [jefe_oficina, admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la DecisionFinal' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DecisionesController.prototype, "getDetalle", null);
__decorate([
    (0, common_1.Get)(':id/seguimiento'),
    (0, swagger_1.ApiOperation)({ summary: 'Seguimiento de un trámite observado [jefe_oficina, admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la DecisionFinal' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DecisionesController.prototype, "getSeguimiento", null);
exports.DecisionesController = DecisionesController = __decorate([
    (0, swagger_1.ApiTags)('Decisiones'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, roles_decorator_1.Roles)('jefe_oficina', 'admin'),
    (0, common_1.Controller)('decisiones'),
    __metadata("design:paramtypes", [decisiones_service_1.DecisionesService])
], DecisionesController);
//# sourceMappingURL=decisiones.controller.js.map