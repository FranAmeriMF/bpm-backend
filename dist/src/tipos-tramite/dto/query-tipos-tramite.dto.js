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
exports.QueryTiposTramiteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
class QueryTiposTramiteDto extends pagination_dto_1.PaginationDto {
    estado;
    requiere_pago;
    buscar;
}
exports.QueryTiposTramiteDto = QueryTiposTramiteDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.TipoTramiteStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TipoTramiteStatus),
    __metadata("design:type", String)
], QueryTiposTramiteDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filtrar por si requiere pago' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' ? true : value === 'false' ? false : undefined),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QueryTiposTramiteDto.prototype, "requiere_pago", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Buscar por nombre o código' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTiposTramiteDto.prototype, "buscar", void 0);
//# sourceMappingURL=query-tipos-tramite.dto.js.map