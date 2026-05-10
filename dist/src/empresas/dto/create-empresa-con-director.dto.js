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
exports.CreateEmpresaConDirectorDto = exports.NuevoDirectorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class NuevoDirectorDto {
    nombre;
    apellido;
    email;
    dni;
    telefono;
    cargo;
}
exports.NuevoDirectorDto = NuevoDirectorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Juan' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NuevoDirectorDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pérez' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NuevoDirectorDto.prototype, "apellido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'director@empresa.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], NuevoDirectorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NuevoDirectorDto.prototype, "dni", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+549112345678' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NuevoDirectorDto.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Director General' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NuevoDirectorDto.prototype, "cargo", void 0);
class CreateEmpresaConDirectorDto {
    razon_social;
    nombre_fantasia;
    cuit;
    direccion;
    telefono;
    email;
    director;
}
exports.CreateEmpresaConDirectorDto = CreateEmpresaConDirectorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tech Solutions SRL' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaConDirectorDto.prototype, "razon_social", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'TechSol' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaConDirectorDto.prototype, "nombre_fantasia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '30-12345678-9' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaConDirectorDto.prototype, "cuit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Av. Siempre Viva 742' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaConDirectorDto.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+5491123456789' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaConDirectorDto.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'contacto@techsol.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateEmpresaConDirectorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: NuevoDirectorDto, description: 'Datos del director — se crea como usuario con rol director' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => NuevoDirectorDto),
    __metadata("design:type", NuevoDirectorDto)
], CreateEmpresaConDirectorDto.prototype, "director", void 0);
//# sourceMappingURL=create-empresa-con-director.dto.js.map