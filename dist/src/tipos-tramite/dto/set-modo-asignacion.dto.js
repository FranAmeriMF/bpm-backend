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
exports.SetModoAsignacionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class SetModoAsignacionDto {
    modo_asignacion;
    oficinas_ids;
}
exports.SetModoAsignacionDto = SetModoAsignacionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ModoAsignacion, description: 'Modo de asignación: automático (oficinas preseleccionadas) o manual (moderador asigna caso por caso)' }),
    (0, class_validator_1.IsEnum)(client_1.ModoAsignacion),
    __metadata("design:type", String)
], SetModoAsignacionDto.prototype, "modo_asignacion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'IDs de oficinas del sistema para asignación automática (obligatorio si modo = automatico)',
        example: ['uuid-oficina-1', 'uuid-oficina-2'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    __metadata("design:type", Array)
], SetModoAsignacionDto.prototype, "oficinas_ids", void 0);
//# sourceMappingURL=set-modo-asignacion.dto.js.map