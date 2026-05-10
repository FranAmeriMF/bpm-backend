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
exports.EmpresasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const empresas_service_1 = require("./empresas.service");
const create_empresa_con_director_dto_1 = require("./dto/create-empresa-con-director.dto");
const update_empresa_dto_1 = require("./dto/update-empresa.dto");
const query_empresas_dto_1 = require("./dto/query-empresas.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let EmpresasController = class EmpresasController {
    empresasService;
    constructor(empresasService) {
        this.empresasService = empresasService;
    }
    create(dto) {
        return this.empresasService.create(dto);
    }
    findAll(query) {
        return this.empresasService.findAll(query);
    }
    findOne(id) {
        return this.empresasService.findOne(id);
    }
    getEstadisticas(id) {
        return this.empresasService.getEstadisticas(id);
    }
    getUsuarios(id) {
        return this.empresasService.getUsuarios(id);
    }
    getTramites(id, estado) {
        return this.empresasService.getTramites(id, estado);
    }
    update(id, dto) {
        return this.empresasService.update(id, dto);
    }
    changeStatus(id, estado) {
        return this.empresasService.changeStatus(id, estado);
    }
    remove(id) {
        return this.empresasService.remove(id);
    }
};
exports.EmpresasController = EmpresasController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear empresa + director [admin] — crea la empresa y su usuario director en una transacción' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Empresa y usuario director creados. Se envía email con contraseña temporal al director.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_empresa_con_director_dto_1.CreateEmpresaConDirectorDto]),
    __metadata("design:returntype", void 0)
], EmpresasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'moderador'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar empresas [admin, moderador]' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_empresas_dto_1.QueryEmpresasDto]),
    __metadata("design:returntype", void 0)
], EmpresasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'director', 'moderador'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener empresa [admin, director, moderador]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmpresasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/estadisticas'),
    (0, roles_decorator_1.Roles)('admin', 'director'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas de trámites y usuarios de una empresa [admin, director]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmpresasController.prototype, "getEstadisticas", null);
__decorate([
    (0, common_1.Get)(':id/usuarios'),
    (0, roles_decorator_1.Roles)('admin', 'director'),
    (0, swagger_1.ApiOperation)({ summary: 'Usuarios de una empresa [admin, director]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmpresasController.prototype, "getUsuarios", null);
__decorate([
    (0, common_1.Get)(':id/tramites'),
    (0, roles_decorator_1.Roles)('admin', 'director', 'moderador'),
    (0, swagger_1.ApiOperation)({ summary: 'Trámites de una empresa [admin, director, moderador]' }),
    (0, swagger_1.ApiQuery)({ name: 'estado', type: String, required: false }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EmpresasController.prototype, "getTramites", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'director'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar empresa [admin, director]' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_empresa_dto_1.UpdateEmpresaDto]),
    __metadata("design:returntype", void 0)
], EmpresasController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar estado de empresa [admin]' }),
    (0, swagger_1.ApiQuery)({ name: 'estado', enum: client_1.EmpresaStatus, required: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EmpresasController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar empresa [admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmpresasController.prototype, "remove", null);
exports.EmpresasController = EmpresasController = __decorate([
    (0, swagger_1.ApiTags)('Empresas'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('empresas'),
    __metadata("design:paramtypes", [empresas_service_1.EmpresasService])
], EmpresasController);
//# sourceMappingURL=empresas.controller.js.map