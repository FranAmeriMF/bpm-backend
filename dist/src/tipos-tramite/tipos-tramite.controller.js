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
exports.TiposTramiteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tipos_tramite_service_1 = require("./tipos-tramite.service");
const create_tipos_tramite_dto_1 = require("./dto/create-tipos-tramite.dto");
const update_tipos_tramite_dto_1 = require("./dto/update-tipos-tramite.dto");
const query_tipos_tramite_dto_1 = require("./dto/query-tipos-tramite.dto");
const create_seccion_dto_1 = require("./dto/create-seccion.dto");
const update_seccion_dto_1 = require("./dto/update-seccion.dto");
const create_campo_dto_1 = require("./dto/create-campo.dto");
const update_campo_dto_1 = require("./dto/update-campo.dto");
const set_modo_asignacion_dto_1 = require("./dto/set-modo-asignacion.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let TiposTramiteController = class TiposTramiteController {
    tiposTramiteService;
    constructor(tiposTramiteService) {
        this.tiposTramiteService = tiposTramiteService;
    }
    create(dto) {
        return this.tiposTramiteService.create(dto);
    }
    findAll(query) {
        return this.tiposTramiteService.findAll(query);
    }
    findOne(id) {
        return this.tiposTramiteService.findOne(id);
    }
    update(id, dto) {
        return this.tiposTramiteService.update(id, dto);
    }
    remove(id) {
        return this.tiposTramiteService.remove(id);
    }
    activar(id) {
        return this.tiposTramiteService.activar(id);
    }
    crearNuevaVersion(id) {
        return this.tiposTramiteService.crearNuevaVersion(id);
    }
    setModoAsignacion(id, dto) {
        return this.tiposTramiteService.setModoAsignacion(id, dto);
    }
    addSeccion(id, dto) {
        return this.tiposTramiteService.addSeccion(id, dto);
    }
    updateSeccion(id, seccion_id, dto) {
        return this.tiposTramiteService.updateSeccion(id, seccion_id, dto);
    }
    deleteSeccion(id, seccion_id) {
        return this.tiposTramiteService.deleteSeccion(id, seccion_id);
    }
    reorderSecciones(id, ids) {
        return this.tiposTramiteService.reorderSecciones(id, ids);
    }
    addCampo(id, seccion_id, dto) {
        return this.tiposTramiteService.addCampo(id, seccion_id, dto);
    }
    updateCampo(id, seccion_id, campo_id, dto) {
        return this.tiposTramiteService.updateCampo(id, seccion_id, campo_id, dto);
    }
    deleteCampo(id, seccion_id, campo_id) {
        return this.tiposTramiteService.deleteCampo(id, seccion_id, campo_id);
    }
    reorderCampos(id, seccion_id, ids) {
        return this.tiposTramiteService.reorderCampos(id, seccion_id, ids);
    }
};
exports.TiposTramiteController = TiposTramiteController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear tipo de trámite [admin] — inicia en estado borrador' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Creado con estado borrador.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tipos_tramite_dto_1.CreateTiposTramiteDto]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar tipos de trámite [todos]' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_tipos_tramite_dto_1.QueryTiposTramiteDto]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener tipo de trámite con formulario completo [todos]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar datos básicos del tipo de trámite [admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tipos_tramite_dto_1.UpdateTiposTramiteDto]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar tipo de trámite [admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/activar'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Activar tipo de trámite (borrador → activo) [admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "activar", null);
__decorate([
    (0, common_1.Post)(':id/nueva-version'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nueva versión borrador a partir de un tipo activo [admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "crearNuevaVersion", null);
__decorate([
    (0, common_1.Patch)(':id/asignacion'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Configurar modo de asignación (automático/manual) [admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_modo_asignacion_dto_1.SetModoAsignacionDto]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "setModoAsignacion", null);
__decorate([
    (0, common_1.Post)(':id/secciones'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar sección al formulario [admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del tipo de trámite' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_seccion_dto_1.CreateSeccionDto]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "addSeccion", null);
__decorate([
    (0, common_1.Patch)(':id/secciones/:seccion_id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Editar sección [admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, swagger_1.ApiParam)({ name: 'seccion_id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('seccion_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_seccion_dto_1.UpdateSeccionDto]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "updateSeccion", null);
__decorate([
    (0, common_1.Delete)(':id/secciones/:seccion_id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar sección (solo si no tiene campos) [admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, swagger_1.ApiParam)({ name: 'seccion_id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('seccion_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "deleteSeccion", null);
__decorate([
    (0, common_1.Patch)(':id/secciones/reorder'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Reordenar secciones [admin] — body: { ids: ["uuid1","uuid2",...] }' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "reorderSecciones", null);
__decorate([
    (0, common_1.Post)(':id/secciones/:seccion_id/campos'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar campo a una sección [admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, swagger_1.ApiParam)({ name: 'seccion_id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('seccion_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_campo_dto_1.CreateCampoDto]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "addCampo", null);
__decorate([
    (0, common_1.Patch)(':id/secciones/:seccion_id/campos/:campo_id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Editar campo [admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, swagger_1.ApiParam)({ name: 'seccion_id' }),
    (0, swagger_1.ApiParam)({ name: 'campo_id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('seccion_id')),
    __param(2, (0, common_1.Param)('campo_id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_campo_dto_1.UpdateCampoDto]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "updateCampo", null);
__decorate([
    (0, common_1.Delete)(':id/secciones/:seccion_id/campos/:campo_id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar campo [admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, swagger_1.ApiParam)({ name: 'seccion_id' }),
    (0, swagger_1.ApiParam)({ name: 'campo_id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('seccion_id')),
    __param(2, (0, common_1.Param)('campo_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "deleteCampo", null);
__decorate([
    (0, common_1.Patch)(':id/secciones/:seccion_id/campos/reorder'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Reordenar campos dentro de una sección [admin] — body: { ids: [...] }' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, swagger_1.ApiParam)({ name: 'seccion_id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('seccion_id')),
    __param(2, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", void 0)
], TiposTramiteController.prototype, "reorderCampos", null);
exports.TiposTramiteController = TiposTramiteController = __decorate([
    (0, swagger_1.ApiTags)('Tipos de Trámite'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('tipos-tramite'),
    __metadata("design:paramtypes", [tipos_tramite_service_1.TiposTramiteService])
], TiposTramiteController);
//# sourceMappingURL=tipos-tramite.controller.js.map