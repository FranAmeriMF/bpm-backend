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
exports.ReenviarTramiteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const tramite_seccion_dto_1 = require("./tramite-seccion.dto");
class ReenviarTramiteDto {
    secciones;
}
exports.ReenviarTramiteDto = ReenviarTramiteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [tramite_seccion_dto_1.TramiteSeccionDto],
        description: 'Secciones con los datos corregidos',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => tramite_seccion_dto_1.TramiteSeccionDto),
    __metadata("design:type", Array)
], ReenviarTramiteDto.prototype, "secciones", void 0);
//# sourceMappingURL=reenviar-tramite.dto.js.map