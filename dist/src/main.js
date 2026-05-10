"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const multipart_1 = __importDefault(require("@fastify/multipart"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    await app.register(multipart_1.default, {
        limits: { fileSize: 10 * 1024 * 1024 },
    });
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API — Sistema de Trámites')
        .setDescription('Para autenticarte: usá `POST /api/auth/login` para obtener el `access_token` ' +
        'y luego pegalo en el botón **Authorize 🔒** (arriba a la derecha).')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'JWT')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3005;
    await app.listen(port, '0.0.0.0');
    console.log(`Aplicación corriendo en: http://localhost:${port}/api`);
    console.log(`Documentación Swagger en: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map