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
exports.AsignarTramiteDto = exports.AsignarOficinaItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class AsignarOficinaItemDto {
    oficina_id;
}
exports.AsignarOficinaItemDto = AsignarOficinaItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-oficina', description: 'ID de la oficina municipal' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AsignarOficinaItemDto.prototype, "oficina_id", void 0);
class AsignarTramiteDto {
    oficinas;
    jefe_decisor_id;
}
exports.AsignarTramiteDto = AsignarTramiteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AsignarOficinaItemDto], description: 'Oficinas a las que se asigna el trámite' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AsignarOficinaItemDto),
    __metadata("design:type", Array)
], AsignarTramiteDto.prototype, "oficinas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-jefe-decisor', description: 'Jefe de oficina que tomará la decisión final' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AsignarTramiteDto.prototype, "jefe_decisor_id", void 0);
//# sourceMappingURL=asignar-tramite.dto.js.map