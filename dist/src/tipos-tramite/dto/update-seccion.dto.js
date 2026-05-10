"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSeccionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_seccion_dto_1 = require("./create-seccion.dto");
class UpdateSeccionDto extends (0, swagger_1.PartialType)(create_seccion_dto_1.CreateSeccionDto) {
}
exports.UpdateSeccionDto = UpdateSeccionDto;
//# sourceMappingURL=update-seccion.dto.js.map