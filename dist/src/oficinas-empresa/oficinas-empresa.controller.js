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
exports.OficinasEmpresaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const oficinas_empresa_service_1 = require("./oficinas-empresa.service");
const create_oficina_empresa_dto_1 = require("./dto/create-oficina-empresa.dto");
const update_oficina_empresa_dto_1 = require("./dto/update-oficina-empresa.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let OficinasEmpresaController = class OficinasEmpresaController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(empresa_id, dto) {
        return this.service.create(empresa_id, dto);
    }
    findAll(empresa_id) {
        return this.service.findAll(empresa_id);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
    asignarUsuario(id, usuario_id, user) {
        return this.service.asignarUsuario(id, usuario_id, user.id);
    }
    desasignarUsuario(id, usuario_id) {
        return this.service.desasignarUsuario(id, usuario_id);
    }
};
exports.OficinasEmpresaController = OficinasEmpresaController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('director', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear oficina/sucursal de la empresa [director, admin]' }),
    __param(0, (0, common_1.Param)('empresa_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_oficina_empresa_dto_1.CreateOficinaEmpresaDto]),
    __metadata("design:returntype", void 0)
], OficinasEmpresaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('director', 'admin', 'moderador'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar oficinas de la empresa [director, admin, moderador]' }),
    __param(0, (0, common_1.Param)('empresa_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OficinasEmpresaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('director', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalle de oficina [director, admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OficinasEmpresaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('director', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar oficina [director, admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_oficina_empresa_dto_1.UpdateOficinaEmpresaDto]),
    __metadata("design:returntype", void 0)
], OficinasEmpresaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('director', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar oficina [director, admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OficinasEmpresaController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/usuarios/:usuario_id'),
    (0, roles_decorator_1.Roles)('director', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Asignar usuario solicitante a esta oficina [director, admin]' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la oficina de empresa' }),
    (0, swagger_1.ApiParam)({ name: 'usuario_id', description: 'ID del usuario solicitante' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('usuario_id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], OficinasEmpresaController.prototype, "asignarUsuario", null);
__decorate([
    (0, common_1.Delete)(':id/usuarios/:usuario_id'),
    (0, roles_decorator_1.Roles)('director', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Quitar usuario de esta oficina [director, admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('usuario_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OficinasEmpresaController.prototype, "desasignarUsuario", null);
exports.OficinasEmpresaController = OficinasEmpresaController = __decorate([
    (0, swagger_1.ApiTags)('Oficinas de Empresa'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('empresas/:empresa_id/oficinas'),
    __metadata("design:paramtypes", [oficinas_empresa_service_1.OficinasEmpresaService])
], OficinasEmpresaController);
//# sourceMappingURL=oficinas-empresa.controller.js.map