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
exports.PlantillasMensajeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const plantillas_mensaje_service_1 = require("./plantillas-mensaje.service");
const create_plantillas_mensaje_dto_1 = require("./dto/create-plantillas-mensaje.dto");
const update_plantillas_mensaje_dto_1 = require("./dto/update-plantillas-mensaje.dto");
const query_plantillas_dto_1 = require("./dto/query-plantillas.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let PlantillasMensajeController = class PlantillasMensajeController {
    plantillasMensajeService;
    constructor(plantillasMensajeService) {
        this.plantillasMensajeService = plantillasMensajeService;
    }
    create(dto) {
        return this.plantillasMensajeService.create(dto);
    }
    findAll(query) {
        return this.plantillasMensajeService.findAll(query);
    }
    findOne(id) {
        return this.plantillasMensajeService.findOne(id);
    }
    update(id, dto) {
        return this.plantillasMensajeService.update(id, dto);
    }
    remove(id) {
        return this.plantillasMensajeService.remove(id);
    }
};
exports.PlantillasMensajeController = PlantillasMensajeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear plantilla [admin, jefe_oficina]' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Creada.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plantillas_mensaje_dto_1.CreatePlantillasMensajeDto]),
    __metadata("design:returntype", void 0)
], PlantillasMensajeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar plantillas [admin, jefe_oficina]' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_plantillas_dto_1.QueryPlantillasDto]),
    __metadata("design:returntype", void 0)
], PlantillasMensajeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener plantilla [admin, jefe_oficina]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlantillasMensajeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar plantilla [admin, jefe_oficina]' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plantillas_mensaje_dto_1.UpdatePlantillasMensajeDto]),
    __metadata("design:returntype", void 0)
], PlantillasMensajeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar plantilla [admin, jefe_oficina]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlantillasMensajeController.prototype, "remove", null);
exports.PlantillasMensajeController = PlantillasMensajeController = __decorate([
    (0, swagger_1.ApiTags)('Plantillas de Mensaje'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, roles_decorator_1.Roles)('admin', 'jefe_oficina'),
    (0, common_1.Controller)('plantillas-mensaje'),
    __metadata("design:paramtypes", [plantillas_mensaje_service_1.PlantillasMensajeService])
], PlantillasMensajeController);
//# sourceMappingURL=plantillas-mensaje.controller.js.map