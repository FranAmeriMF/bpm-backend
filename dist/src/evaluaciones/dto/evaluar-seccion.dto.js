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
exports.EvaluarSeccionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EvaluarSeccionDto {
    asignacion_oficina_id;
    seccion_id;
    aprobada;
    motivo_rechazo;
    evaluado_por;
}
exports.EvaluarSeccionDto = EvaluarSeccionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-asignacion', description: 'ID de la asignación de oficina' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EvaluarSeccionDto.prototype, "asignacion_oficina_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-seccion', description: 'ID de la sección a evaluar (SeccionTipoTramite)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EvaluarSeccionDto.prototype, "seccion_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Si la sección fue aprobada' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EvaluarSeccionDto.prototype, "aprobada", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Falta el certificado de habilitación vigente', description: 'Motivo de rechazo (obligatorio si aprobada = false)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluarSeccionDto.prototype, "motivo_rechazo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-jefe', description: 'ID del jefe evaluador' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EvaluarSeccionDto.prototype, "evaluado_por", void 0);
//# sourceMappingURL=evaluar-seccion.dto.js.map