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
exports.CreateCampoDto = exports.TipoCampo = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TipoCampo;
(function (TipoCampo) {
    TipoCampo["text"] = "text";
    TipoCampo["textarea"] = "textarea";
    TipoCampo["number"] = "number";
    TipoCampo["date"] = "date";
    TipoCampo["select"] = "select";
    TipoCampo["checkbox_group"] = "checkbox_group";
    TipoCampo["radio"] = "radio";
    TipoCampo["file"] = "file";
    TipoCampo["checkbox"] = "checkbox";
})(TipoCampo || (exports.TipoCampo = TipoCampo = {}));
class CreateCampoDto {
    nombre;
    etiqueta;
    tipo;
    obligatorio;
    placeholder;
    descripcion;
    valor_defecto;
    opciones;
    validaciones;
}
exports.CreateCampoDto = CreateCampoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'nombre_solicitante', description: 'Nombre interno único (solo letras, números, guiones bajos)' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[a-z][a-z0-9_]*$/, { message: 'nombre debe usar solo minúsculas, números y guiones bajos, empezando con letra' }),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateCampoDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nombre del solicitante', description: 'Etiqueta visible para el usuario' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCampoDto.prototype, "etiqueta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TipoCampo, description: 'Tipo de campo del formulario' }),
    (0, class_validator_1.IsEnum)(TipoCampo),
    __metadata("design:type", String)
], CreateCampoDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCampoDto.prototype, "obligatorio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ingrese su nombre...', description: 'Texto de ejemplo dentro del campo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCampoDto.prototype, "placeholder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Texto de ayuda mostrado debajo del campo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateCampoDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Valor por defecto del campo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCampoDto.prototype, "valor_defecto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Opciones para campos select, checkbox_group y radio',
        example: ['Opción A', 'Opción B'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCampoDto.prototype, "opciones", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Validaciones específicas del campo',
        example: { min_length: 2, max_length: 50 },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCampoDto.prototype, "validaciones", void 0);
//# sourceMappingURL=create-campo.dto.js.map