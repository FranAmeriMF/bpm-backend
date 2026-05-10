import { Controller, Post, Param, Get, Req, Res, Delete, BadRequestException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import type { FastifyRequest, FastifyReply } from 'fastify';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ArchivosService } from './archivos.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/decorators/current-user.decorator';

const ALLOWED_MIME = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

@ApiTags('Archivos')
@ApiBearerAuth('JWT')
@Controller('archivos')
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  @Post('upload/:tramite_id')
  @Roles('solicitante', 'admin')
  @ApiOperation({ summary: 'Subir archivo para un trámite [solicitante, admin] — PDF, JPG, PNG o DOCX, máx. 10 MB' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'tramite_id', description: 'ID del trámite' })
  @ApiQuery({ name: 'seccion_id', required: false, description: 'ID de la sección a la que pertenece el archivo' })
  async uploadFile(
    @Param('tramite_id') tramite_id: string,
    @Query('seccion_id') seccion_id: string | undefined,
    @CurrentUser() user: RequestUser,
    @Req() req: FastifyRequest,
  ) {
    if (!req.isMultipart()) throw new BadRequestException('El request no es multipart');

    const data = await req.file();
    if (!data) throw new BadRequestException('No se envió ningún archivo');

    if (!ALLOWED_MIME.includes(data.mimetype)) {
      throw new BadRequestException('Tipo de archivo no permitido. Solo PDF, JPG, PNG o DOCX.');
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `${Date.now()}-${data.filename}`;
    const filepath = path.join(uploadsDir, filename);

    await new Promise<void>((resolve, reject) => {
      data.file.pipe(fs.createWriteStream(filepath))
        .on('finish', resolve)
        .on('error', reject);
    });

    const size = fs.statSync(filepath).size;
    if (size > MAX_SIZE_BYTES) {
      fs.unlinkSync(filepath);
      throw new BadRequestException('El archivo supera el límite de 10 MB.');
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

  @Get(':id/download')
  @ApiOperation({ summary: 'Descargar archivo [todos]' })
  async download(@Param('id') id: string, @Res() res: FastifyReply) {
    const archivo = await this.archivosService.findOne(id);
    if (!fs.existsSync(archivo.ruta)) throw new BadRequestException('El archivo físico no existe');

    res.header('Content-Type', archivo.tipo_mime ?? 'application/octet-stream');
    res.header('Content-Disposition', `attachment; filename="${archivo.nombre_original}"`);
    return res.send(fs.createReadStream(archivo.ruta));
  }

  @Delete(':id')
  @Roles('solicitante', 'admin')
  @ApiOperation({ summary: 'Eliminar archivo [solicitante, admin]' })
  async remove(@Param('id') id: string) {
    return this.archivosService.remove(id);
  }
}
