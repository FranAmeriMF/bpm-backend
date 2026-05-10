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
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateUserDto {
    nombre;
    apellido;
    email;
    dni;
    telefono;
    rol;
    estado;
    empresa_id;
    oficina_id;
    cargo;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Juan', description: 'Nombre del usuario' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pérez', description: 'Apellido del usuario' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "apellido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'juan@example.com', description: 'Correo electrónico' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678', description: 'Documento Nacional de Identidad' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "dni", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+549112345678', description: 'Teléfono de contacto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.UserRole, default: client_1.UserRole.solicitante, description: 'Rol en el sistema' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], CreateUserDto.prototype, "rol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.UserStatus, default: client_1.UserStatus.activo, description: 'Estado de la cuenta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.UserStatus),
    __metadata("design:type", String)
], CreateUserDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid', description: 'ID de la empresa a la que pertenece' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "empresa_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid', description: 'ID de la oficina (solo jefes)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "oficina_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Director de IT', description: 'Cargo del usuario en la empresa u oficina' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "cargo", void 0);
//# sourceMappingURL=create-user.dto.js.map