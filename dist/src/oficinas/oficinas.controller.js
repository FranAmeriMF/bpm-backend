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
exports.OficinasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const oficinas_service_1 = require("./oficinas.service");
const create_oficina_dto_1 = require("./dto/create-oficina.dto");
const update_oficina_dto_1 = require("./dto/update-oficina.dto");
const query_oficinas_dto_1 = require("./dto/query-oficinas.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let OficinasController = class OficinasController {
    oficinasService;
    constructor(oficinasService) {
        this.oficinasService = oficinasService;
    }
    create(dto) {
        return this.oficinasService.create(dto);
    }
    findAll(query) {
        return this.oficinasService.findAll(query);
    }
    findOne(id) {
        return this.oficinasService.findOne(id);
    }
    getJefes(id) {
        return this.oficinasService.getJefes(id);
    }
    update(id, dto) {
        return this.oficinasService.update(id, dto);
    }
    remove(id) {
        return this.oficinasService.remove(id);
    }
};
exports.OficinasController = OficinasController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear oficina [admin]' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Oficina creada.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_oficina_dto_1.CreateOficinaDto]),
    __metadata("design:returntype", void 0)
], OficinasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar oficinas [todos los autenticados]' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_oficinas_dto_1.QueryOficinasDto]),
    __metadata("design:returntype", void 0)
], OficinasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'moderador'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener oficina por ID [admin, moderador]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OficinasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/jefes'),
    (0, roles_decorator_1.Roles)('admin', 'moderador'),
    (0, swagger_1.ApiOperation)({ summary: 'Jefes de una oficina [admin, moderador]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OficinasController.prototype, "getJefes", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar oficina [admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_oficina_dto_1.UpdateOficinaDto]),
    __metadata("design:returntype", void 0)
], OficinasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar oficina [admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OficinasController.prototype, "remove", null);
exports.OficinasController = OficinasController = __decorate([
    (0, swagger_1.ApiTags)('Oficinas'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('oficinas'),
    __metadata("design:paramtypes", [oficinas_service_1.OficinasService])
], OficinasController);
//# sourceMappingURL=oficinas.controller.js.map