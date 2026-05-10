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
exports.UpdateTramiteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const tramite_seccion_dto_1 = require("./tramite-seccion.dto");
class UpdateTramiteDto {
    oficina_empresa_id;
    secciones;
}
exports.UpdateTramiteDto = UpdateTramiteDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-oficina-empresa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTramiteDto.prototype, "oficina_empresa_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [tramite_seccion_dto_1.TramiteSeccionDto],
        description: 'Secciones a actualizar (solo las enviadas se modifican)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => tramite_seccion_dto_1.TramiteSeccionDto),
    __metadata("design:type", Array)
], UpdateTramiteDto.prototype, "secciones", void 0);
//# sourceMappingURL=update-tramite.dto.js.map