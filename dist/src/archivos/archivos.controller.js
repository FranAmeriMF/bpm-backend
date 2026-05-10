"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchivosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const archivos_service_1 = require("./archivos.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const ALLOWED_MIME = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
let ArchivosController = class ArchivosController {
    archivosService;
    constructor(archivosService) {
        this.archivosService = archivosService;
    }
    async uploadFile(tramite_id, seccion_id, user, req) {
        if (!req.isMultipart())
            throw new common_1.BadRequestException('El request no es multipart');
        const data = await req.file();
        if (!data)
            throw new common_1.BadRequestException('No se envió ningún archivo');
        if (!ALLOWED_MIME.includes(data.mimetype)) {
            throw new common_1.BadRequestException('Tipo de archivo no permitido. Solo PDF, JPG, PNG o DOCX.');
        }
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir))
            fs.mkdirSync(uploadsDir, { recursive: true });
        const filename = `${Date.now()}-${data.filename}`;
        const filepath = path.join(uploadsDir, filename);
        await new Promise((resolve, reject) => {
            data.file.pipe(fs.createWriteStream(filepath))
                .on('finish', resolve)
                .on('error', reject);
        });
        const size = fs.statSync(filepath).size;
        if (size > MAX_SIZE_BYTES) {
            fs.unlinkSync(filepath);
            throw new common_1.BadRequestException('El archivo supera el límite de 10 MB.');
        }
        const archivo = await this.archivosService.create({
            tramite_id,
            subido_por: user.id,
            seccion_id: seccion_id || undefined,
            nombre_original: data.filename,
            nombre_archivo: filename,
            ruta: filepath,
            tipo_mime: data.mimetype,
            tamano_bytes: BigInt(size),
        });
        return { ...archivo, tamano_bytes: archivo.tamano_bytes?.toString() };
    }
    async download(id, res) {
        const archivo = await this.archivosService.findOne(id);
        if (!fs.existsSync(archivo.ruta))
            throw new common_1.BadRequestException('El archivo físico no existe');
        res.header('Content-Type', archivo.tipo_mime ?? 'application/octet-stream');
        res.header('Content-Disposition', `attachment; filename="${archivo.nombre_original}"`);
        return res.send(fs.createReadStream(archivo.ruta));
    }
    async remove(id) {
        return this.archivosService.remove(id);
    }
};
exports.ArchivosController = ArchivosController;
__decorate([
    (0, common_1.Post)('upload/:tramite_id'),
    (0, roles_decorator_1.Roles)('solicitante', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Subir archivo para un trámite [solicitante, admin] — PDF, JPG, PNG o DOCX, máx. 10 MB' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'tramite_id', description: 'ID del trámite' }),
    (0, swagger_1.ApiQuery)({ name: 'seccion_id', required: false, description: 'ID de la sección a la que pertenece el archivo' }),
    __param(0, (0, common_1.Param)('tramite_id')),
    __param(1, (0, common_1.Query)('seccion_id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ArchivosController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Descargar archivo [todos]' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArchivosController.prototype, "download", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('solicitante', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar archivo [solicitante, admin]' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArchivosController.prototype, "remove", null);
exports.ArchivosController = ArchivosController = __decorate([
    (0, swagger_1.ApiTags)('Archivos'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('archivos'),
    __metadata("design:paramtypes", [archivos_service_1.ArchivosService])
], ArchivosController);
//# sourceMappingURL=archivos.controller.js.map