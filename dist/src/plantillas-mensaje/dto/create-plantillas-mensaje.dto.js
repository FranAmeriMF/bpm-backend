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
exports.CreatePlantillasMensajeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreatePlantillasMensajeDto {
    oficina_id;
    nombre;
    tipo_decision;
    contenido;
    estado;
    creada_por;
}
exports.CreatePlantillasMensajeDto = CreatePlantillasMensajeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-oficina', description: 'ID de la oficina dueña de la plantilla' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlantillasMensajeDto.prototype, "oficina_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Aprobación Estándar', description: 'Nombre interno de la plantilla' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlantillasMensajeDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.DecisionTipo, description: 'Tipo de decisión que usa esta plantilla' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(client_1.DecisionTipo),
    __metadata("design:type", String)
], CreatePlantillasMensajeDto.prototype, "tipo_decision", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Estimado [NOMBRE_SOLICITANTE]...', description: 'Contenido del mensaje con variables' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlantillasMensajeDto.prototype, "contenido", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.PlantillaEstado, default: client_1.PlantillaEstado.activa, description: 'Estado de la plantilla' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PlantillaEstado),
    __metadata("design:type", String)
], CreatePlantillasMensajeDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-creador', description: 'Usuario creador' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlantillasMensajeDto.prototype, "creada_por", void 0);
//# sourceMappingURL=create-plantillas-mensaje.dto.js.map