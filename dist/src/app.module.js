"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const empresas_module_1 = require("./empresas/empresas.module");
const oficinas_module_1 = require("./oficinas/oficinas.module");
const tipos_tramite_module_1 = require("./tipos-tramite/tipos-tramite.module");
const plantillas_mensaje_module_1 = require("./plantillas-mensaje/plantillas-mensaje.module");
const tramites_module_1 = require("./tramites/tramites.module");
const archivos_module_1 = require("./archivos/archivos.module");
const evaluaciones_module_1 = require("./evaluaciones/evaluaciones.module");
const notificaciones_module_1 = require("./notificaciones/notificaciones.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const roles_guard_1 = require("./auth/guards/roles.guard");
const decisiones_module_1 = require("./decisiones/decisiones.module");
const reportes_module_1 = require("./reportes/reportes.module");
const mail_module_1 = require("./mail/mail.module");
const oficinas_empresa_module_1 = require("./oficinas-empresa/oficinas-empresa.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            empresas_module_1.EmpresasModule,
            oficinas_module_1.OficinasModule,
            tipos_tramite_module_1.TiposTramiteModule,
            plantillas_mensaje_module_1.PlantillasMensajeModule,
            tramites_module_1.TramitesModule,
            archivos_module_1.ArchivosModule,
            evaluaciones_module_1.EvaluacionesModule,
            notificaciones_module_1.NotificacionesModule,
            decisiones_module_1.DecisionesModule,
            reportes_module_1.ReportesModule,
            mail_module_1.MailModule,
            oficinas_empresa_module_1.OficinasEmpresaModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map