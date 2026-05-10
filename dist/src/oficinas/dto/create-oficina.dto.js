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
exports.CreateOficinaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateOficinaDto {
    nombre;
    descripcion;
    codigo;
    estado;
    email;
    permite_decision_final;
}
exports.CreateOficinaDto = CreateOficinaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Oficina de Obras', description: 'Nombre de la oficina' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOficinaDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Se encarga de los permisos de obra', description: 'Descripción de la oficina' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOficinaDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OBRAS', description: 'Código único de la oficina' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOficinaDto.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.OficinaStatus, default: client_1.OficinaStatus.activa, description: 'Estado de la oficina' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.OficinaStatus),
    __metadata("design:type", String)
], CreateOficinaDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'obras@municipio.gob.ar', description: 'Email de la oficina' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOficinaDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, description: '¿Esta oficina puede tomar decisiones finales?' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateOficinaDto.prototype, "permite_decision_final", void 0);
//# sourceMappingURL=create-oficina.dto.js.map