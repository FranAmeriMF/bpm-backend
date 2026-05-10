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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryTramitesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
class QueryTramitesDto extends pagination_dto_1.PaginationDto {
    empresa_id;
    estado;
    tipo_tramite_id;
    solicitante_id;
    oficina_empresa_id;
    numero;
    fecha_desde;
    fecha_hasta;
}
exports.QueryTramitesDto = QueryTramitesDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de empresa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTramitesDto.prototype, "empresa_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.TramiteEstado }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TramiteEstado),
    __metadata("design:type", String)
], QueryTramitesDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del tipo de trámite' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTramitesDto.prototype, "tipo_tramite_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del solicitante' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTramitesDto.prototype, "solicitante_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de oficina de empresa (sucursal)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTramitesDto.prototype, "oficina_empresa_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Buscar por número de trámite' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTramitesDto.prototype, "numero", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha desde (ISO 8601): 2026-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTramitesDto.prototype, "fecha_desde", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha hasta (ISO 8601): 2026-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTramitesDto.prototype, "fecha_hasta", void 0);
//# sourceMappingURL=query-tramites.dto.js.map