"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantillasMensajeModule = void 0;
const common_1 = require("@nestjs/common");
const plantillas_mensaje_controller_1 = require("./plantillas-mensaje.controller");
const plantillas_mensaje_service_1 = require("./plantillas-mensaje.service");
let PlantillasMensajeModule = class PlantillasMensajeModule {
};
exports.PlantillasMensajeModule = PlantillasMensajeModule;
exports.PlantillasMensajeModule = PlantillasMensajeModule = __decorate([
    (0, common_1.Module)({
        controllers: [plantillas_mensaje_controller_1.PlantillasMensajeController],
        providers: [plantillas_mensaje_service_1.PlantillasMensajeService]
    })
], PlantillasMensajeModule);
//# sourceMappingURL=plantillas-mensaje.module.js.map