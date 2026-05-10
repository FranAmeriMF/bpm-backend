import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyMultipart as any, {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  });

  // Prefijo global
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors();

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve campos no definidos en el DTO
      transform: true, // Transforma los payloads a las instancias de las clases DTO
      forbidNonWhitelisted: true, // Arroja un error si hay campos no permitidos
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API — Sistema de Trámites')
    .setDescription(
      'Para autenticarte: usá `POST /api/auth/login` para obtener el `access_token` ' +
      'y luego pegalo en el botón **Authorize 🔒** (arriba a la derecha).',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3005;
  await app.listen(port, '0.0.0.0');
  console.log(`Aplicación corriendo en: http://localhost:${port}/api`);
  console.log(`Documentación Swagger en: http://localhost:${port}/api/docs`);
}
bootstrap();
