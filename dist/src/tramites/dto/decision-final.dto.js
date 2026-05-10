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
exports.DecisionFinalDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class DecisionFinalDto {
    decision;
    secciones_a_corregir;
    mensaje_al_solicitante;
    plantilla_usada_id;
}
exports.DecisionFinalDto = DecisionFinalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.DecisionTipo, example: client_1.DecisionTipo.aprobado, description: 'Decisión tomada' }),
    (0, class_validator_1.IsEnum)(client_1.DecisionTipo),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DecisionFinalDto.prototype, "decision", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: [1, 3], description: 'Secciones a corregir (solo si decision = observado)' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DecisionFinalDto.prototype, "secciones_a_corregir", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Estimado solicitante, su trámite ha sido aprobado...', description: 'Mensaje al solicitante' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecisionFinalDto.prototype, "mensaje_al_solicitante", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-plantilla', description: 'ID de la plantilla usada (opcional)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DecisionFinalDto.prototype, "plantilla_usada_id", void 0);
//# sourceMappingURL=decision-final.dto.js.map