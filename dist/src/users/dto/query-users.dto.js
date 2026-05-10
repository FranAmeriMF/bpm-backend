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
exports.QueryUsersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
class QueryUsersDto extends pagination_dto_1.PaginationDto {
    rol;
    tipo;
    estado;
    empresa_id;
    oficina_id;
    buscar;
}
exports.QueryUsersDto = QueryUsersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.UserRole }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], QueryUsersDto.prototype, "rol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['interno', 'externo'],
        description: 'interno → admin/moderador/jefe_oficina/interno | externo → solicitante/director',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['interno', 'externo']),
    __metadata("design:type", String)
], QueryUsersDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.UserStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.UserStatus),
    __metadata("design:type", String)
], QueryUsersDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de empresa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryUsersDto.prototype, "empresa_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de oficina municipal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryUsersDto.prototype, "oficina_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Buscar por nombre, apellido, email o DNI' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryUsersDto.prototype, "buscar", void 0);
//# sourceMappingURL=query-users.dto.js.map