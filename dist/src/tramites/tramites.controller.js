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
exports.TramitesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tramites_service_1 = require("./tramites.service");
const archivos_service_1 = require("../archivos/archivos.service");
const create_tramite_dto_1 = require("./dto/create-tramite.dto");
const update_tramite_dto_1 = require("./dto/update-tramite.dto");
const rechazar_director_dto_1 = require("./dto/rechazar-director.dto");
const asignar_tramite_dto_1 = require("./dto/asignar-tramite.dto");
const decision_final_dto_1 = require("./dto/decision-final.dto");
const reenviar_tramite_dto_1 = require("./dto/reenviar-tramite.dto");
const query_tramites_dto_1 = require("./dto/query-tramites.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let TramitesController = class TramitesController {
    tramitesService;
    archivosService;
    constructor(tramitesService, archivosService) {
        this.tramitesService = tramitesService;
        this.archivosService = archivosService;
    }
    create(dto) {
        return this.tramitesService.create(dto);
    }
    findAll(query, user) {
        return this.tramitesService.findAll(query, user);
    }
    getEstadisticas() {
        return this.tramitesService.getEstadisticas();
    }
    findOne(id) {
        return this.tramitesService.findOne(id);
    }
    getArchivos(id) {
        return this.archivosService.findByTramite(id);
    }
    update(id, dto) {
        return this.tramitesService.update(id, dto);
    }
    remove(id) {
        return this.tramitesService.remove(id);
    }
    enviarDirector(id, user) {
        return this.tramitesService.enviarDirector(id, user.id);
    }
    aprobarDirector(id, user) {
        return this.tramitesService.aprobarDirector(id, user.id);
    }
    rechazarDirector(id, user, dto) {
        return this.tramitesService.rechazarDirector(id, user.id, dto.observaciones);
    }
    asignar(id, user, dto) {
        return this.tramitesService.asignar(id, dto, user.id);
    }
    iniciarRevision(id, user) {
        return this.tramitesService.iniciarRevision(id, user);
    }
    finalizarRevision(id, user) {
        return this.tramitesService.finalizarRevision(id, user);
    }
    decisionFinal(id, user, dto) {
        return this.tramitesService.decisionFinal(id, dto, user.id);
    }
    iniciarCorreccion(id, user) {
        return this.tramitesService.iniciarCorreccion(id, user.id);
    }
    reenviar(id, user, dto) {
        return this.tramitesService.reenviar(id, user.id, dto.secciones);
    }
};
exports.TramitesController = TramitesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('solicitante', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear trámite en borrador [solicitante, admin] — número se genera automáticamente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Trámite creado en estado borrador.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tramite_dto_1.CreateTramiteDto]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar trámites [todos]' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_tramites_dto_1.QueryTramitesDto, Object]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    (0, swagger_1.ApiOperation)({ summary: 'Conteo de trámites agrupado por estado [todos]' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "getEstadisticas", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener trámite completo [todos]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/archivos'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar archivos adjuntos de un trámite [todos]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "getArchivos", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('solicitante', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar datos del formulario [solicitante] — solo en borrador o corrigiendo' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tramite_dto_1.UpdateTramiteDto]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('solicitante', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar trámite [solicitante, admin] — solo en borrador' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/enviar-director'),
    (0, roles_decorator_1.Roles)('solicitante'),
    (0, swagger_1.ApiOperation)({ summary: 'Solicitante envía al director para revisión interna [solicitante]' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del trámite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado → en_revision_interna' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "enviarDirector", null);
__decorate([
    (0, common_1.Post)(':id/aprobar-director'),
    (0, roles_decorator_1.Roles)('director'),
    (0, swagger_1.ApiOperation)({ summary: 'Director aprueba internamente [director]' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del trámite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado → pendiente_asignacion' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "aprobarDirector", null);
__decorate([
    (0, common_1.Post)(':id/rechazar-director'),
    (0, roles_decorator_1.Roles)('director'),
    (0, swagger_1.ApiOperation)({ summary: 'Director rechaza y devuelve al solicitante [director]' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del trámite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado → borrador (con observaciones)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, rechazar_director_dto_1.RechazarDirectorDto]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "rechazarDirector", null);
__decorate([
    (0, common_1.Post)(':id/asignar'),
    (0, roles_decorator_1.Roles)('moderador'),
    (0, swagger_1.ApiOperation)({ summary: 'Moderador asigna el trámite a oficinas [moderador]' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del trámite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado → asignado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, asignar_tramite_dto_1.AsignarTramiteDto]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "asignar", null);
__decorate([
    (0, common_1.Post)(':id/iniciar-revision'),
    (0, roles_decorator_1.Roles)('jefe_oficina', 'interno'),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar revisión técnica [jefe_oficina, interno]' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del trámite' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "iniciarRevision", null);
__decorate([
    (0, common_1.Post)(':id/finalizar-revision'),
    (0, roles_decorator_1.Roles)('jefe_oficina', 'interno'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalizar revisión [jefe_oficina, interno] — si todas terminan → en_revision_final' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del trámite' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "finalizarRevision", null);
__decorate([
    (0, common_1.Post)(':id/decision-final'),
    (0, roles_decorator_1.Roles)('jefe_oficina'),
    (0, swagger_1.ApiOperation)({ summary: 'Decisor toma la decisión final [jefe_oficina con es_decisor=true]' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del trámite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado → aprobado | rechazado | observado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, decision_final_dto_1.DecisionFinalDto]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "decisionFinal", null);
__decorate([
    (0, common_1.Post)(':id/iniciar-correccion'),
    (0, roles_decorator_1.Roles)('solicitante'),
    (0, swagger_1.ApiOperation)({ summary: 'Solicitante inicia edición de correcciones [solicitante] — desde estado observado → corrigiendo' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del trámite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado → corrigiendo' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "iniciarCorreccion", null);
__decorate([
    (0, common_1.Post)(':id/reenviar'),
    (0, roles_decorator_1.Roles)('solicitante'),
    (0, swagger_1.ApiOperation)({ summary: 'Solicitante reenvía con correcciones [solicitante] — desde observado o corrigiendo' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del trámite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado → asignado (nueva ronda de revisión)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, reenviar_tramite_dto_1.ReenviarTramiteDto]),
    __metadata("design:returntype", void 0)
], TramitesController.prototype, "reenviar", null);
exports.TramitesController = TramitesController = __decorate([
    (0, swagger_1.ApiTags)('Trámites'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('tramites'),
    __metadata("design:paramtypes", [tramites_service_1.TramitesService,
        archivos_service_1.ArchivosService])
], TramitesController);
//# sourceMappingURL=tramites.controller.js.map