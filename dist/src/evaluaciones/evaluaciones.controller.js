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
exports.EvaluacionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const evaluaciones_service_1 = require("./evaluaciones.service");
const evaluar_seccion_dto_1 = require("./dto/evaluar-seccion.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let EvaluacionesController = class EvaluacionesController {
    evaluacionesService;
    constructor(evaluacionesService) {
        this.evaluacionesService = evaluacionesService;
    }
    evaluarSeccion(dto) {
        return this.evaluacionesService.evaluarSeccion(dto);
    }
    getByTramite(tramite_id) {
        return this.evaluacionesService.getEvaluacionesByTramite(tramite_id);
    }
    getProgreso(asignacion_id) {
        return this.evaluacionesService.getProgreso(asignacion_id);
    }
    update(id, dto) {
        return this.evaluacionesService.updateEvaluacion(id, dto);
    }
    findOne(id) {
        return this.evaluacionesService.getEvaluacionById(id);
    }
};
exports.EvaluacionesController = EvaluacionesController;
__decorate([
    (0, common_1.Post)('seccion'),
    (0, roles_decorator_1.Roles)('jefe_oficina', 'interno'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluar sección del trámite [jefe_oficina, interno] — crea o actualiza' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sección evaluada.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [evaluar_seccion_dto_1.EvaluarSeccionDto]),
    __metadata("design:returntype", void 0)
], EvaluacionesController.prototype, "evaluarSeccion", null);
__decorate([
    (0, common_1.Get)('tramite/:tramite_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluaciones de un trámite [todos]' }),
    (0, swagger_1.ApiParam)({ name: 'tramite_id' }),
    __param(0, (0, common_1.Param)('tramite_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EvaluacionesController.prototype, "getByTramite", null);
__decorate([
    (0, common_1.Get)('asignacion/:asignacion_id/progreso'),
    (0, roles_decorator_1.Roles)('jefe_oficina', 'interno', 'moderador', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Progreso de una asignación [jefe_oficina, interno, moderador, admin]' }),
    (0, swagger_1.ApiParam)({ name: 'asignacion_id' }),
    __param(0, (0, common_1.Param)('asignacion_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EvaluacionesController.prototype, "getProgreso", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('jefe_oficina', 'interno'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar evaluación existente [jefe_oficina, interno]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, evaluar_seccion_dto_1.EvaluarSeccionDto]),
    __metadata("design:returntype", void 0)
], EvaluacionesController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener evaluación por ID [todos]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EvaluacionesController.prototype, "findOne", null);
exports.EvaluacionesController = EvaluacionesController = __decorate([
    (0, swagger_1.ApiTags)('Evaluaciones'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('evaluaciones'),
    __metadata("design:paramtypes", [evaluaciones_service_1.EvaluacionesService])
], EvaluacionesController);
//# sourceMappingURL=evaluaciones.controller.js.map