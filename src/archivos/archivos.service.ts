import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArchivosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    tramite_id: string;
    subido_por?: string;
    seccion_id?: string;
    nombre_original: string;
    nombre_archivo: string;
    ruta: string;
    tipo_mime: string;
    tamano_bytes: bigint;
  }) {
    return this.prisma.archivo.create({ data });
  }

  async findOne(id: string) {
    const archivo = await this.prisma.archivo.findUnique({ where: { id } });
    if (!archivo) throw new NotFoundException(`Archivo con ID ${id} no encontrado`);
    return archivo;
  }

  findByTramite(tramite_id: string) {
    return this.prisma.archivo.findMany({
      where: { tramite_id },
      include: { seccion: { select: { id: true, titulo: true, orden: true } } },
      orderBy: [{ seccion: { orden: 'asc' } }, { fecha_subida: 'asc' }],
    });
  }

  async remove(id: string) {
    const archivo = await this.findOne(id);
    try {
      const fs = await import('node:fs');
      if (fs.existsSync(archivo.ruta)) fs.unlinkSync(archivo.ruta);
    } catch {
      // El archivo físico puede no existir, continuar con borrado en BD
    }
    return this.prisma.archivo.delete({ where: { id } });
  }
}
