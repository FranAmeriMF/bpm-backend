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
exports.ReportesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reportes_service_1 = require("./reportes.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let ReportesController = class ReportesController {
    reportesService;
    constructor(reportesService) {
        this.reportesService = reportesService;
    }
    getDashboard() {
        return this.reportesService.getDashboard();
    }
    getTramitesPorEstado(fecha_desde, fecha_hasta) {
        return this.reportesService.getTramitesPorEstado(fecha_desde, fecha_hasta);
    }
    getDesempenoOficinas() {
        return this.reportesService.getDesempenoOficinas();
    }
    getDesempenoDecisor(user) {
        return this.reportesService.getDesempenoDecisor(user.id);
    }
    getReporteEmpresa(id) {
        return this.reportesService.getReporteEmpresa(id);
    }
};
exports.ReportesController = ReportesController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)('admin', 'moderador'),
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard general de trámites [admin, moderador]' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('tramites-por-estado'),
    (0, roles_decorator_1.Roles)('admin', 'moderador'),
    (0, swagger_1.ApiOperation)({ summary: 'Trámites agrupados por estado [admin, moderador]' }),
    (0, swagger_1.ApiQuery)({ name: 'fecha_desde', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'fecha_hasta', type: String, required: false }),
    __param(0, (0, common_1.Query)('fecha_desde')),
    __param(1, (0, common_1.Query)('fecha_hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "getTramitesPorEstado", null);
__decorate([
    (0, common_1.Get)('desempeno-oficinas'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Desempeño y tiempos promedio por oficina [admin]' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "getDesempenoOficinas", null);
__decorate([
    (0, common_1.Get)('desempeno-decisor'),
    (0, roles_decorator_1.Roles)('jefe_oficina'),
    (0, swagger_1.ApiOperation)({ summary: 'Mis métricas como decisor [jefe_oficina]' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "getDesempenoDecisor", null);
__decorate([
    (0, common_1.Get)('empresa/:id'),
    (0, roles_decorator_1.Roles)('admin', 'director'),
    (0, swagger_1.ApiOperation)({ summary: 'Historial de trámites de una empresa [admin, director]' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la empresa' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportesController.prototype, "getReporteEmpresa", null);
exports.ReportesController = ReportesController = __decorate([
    (0, swagger_1.ApiTags)('Reportes'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('reportes'),
    __metadata("design:paramtypes", [reportes_service_1.ReportesService])
], ReportesController);
//# sourceMappingURL=reportes.controller.js.map