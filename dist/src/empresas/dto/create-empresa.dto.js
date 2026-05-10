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
exports.CreateEmpresaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateEmpresaDto {
    razon_social;
    nombre_fantasia;
    cuit;
    direccion;
    telefono;
    email;
    estado;
    director_id;
}
exports.CreateEmpresaDto = CreateEmpresaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tech Solutions SRL', description: 'Razón social' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "razon_social", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'TechSol', description: 'Nombre de fantasía' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "nombre_fantasia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '30-12345678-9', description: 'CUIT de la empresa' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "cuit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Av. Siempre Viva 123', description: 'Dirección física' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+549119876543', description: 'Teléfono de contacto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'contacto@techsol.com', description: 'Email corporativo' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.EmpresaStatus, default: client_1.EmpresaStatus.activa, description: 'Estado de la empresa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.EmpresaStatus),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid', description: 'ID del usuario director' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "director_id", void 0);
//# sourceMappingURL=create-empresa.dto.js.map