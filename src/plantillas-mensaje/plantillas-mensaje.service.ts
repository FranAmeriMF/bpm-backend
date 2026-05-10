import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlantillasMensajeDto } from './dto/create-plantillas-mensaje.dto';
import { UpdatePlantillasMensajeDto } from './dto/update-plantillas-mensaje.dto';
import { QueryPlantillasDto } from './dto/query-plantillas.dto';
import { PrismaService } from '../prisma/prisma.service';
import { paginar, paginationParams } from '../common/helpers/paginate.helper';

@Injectable()
export class PlantillasMensajeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePlantillasMensajeDto) {
    return this.prisma.plantillaMensaje.create({ data: dto });
  }

  async findAll(query: QueryPlantillasDto) {
    const { page = 1, limit = 20, oficina_id, tipo_decision, estado, buscar } = query;
    const { skip, take } = paginationParams(page, limit);

    const where: any = {};
    if (oficina_id) where.oficina_id = oficina_id;
    if (tipo_decision) where.tipo_decision = tipo_decision;
    if (estado) where.estado = estado;
    if (buscar) where.nombre = { contains: buscar, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.plantillaMensaje.findMany({
        where, skip, take,
        include: { oficina: { select: { id: true, nombre: true } } },
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.plantillaMensaje.count({ where }),
    ]);

    return paginar(data, total, page, limit);
  }

  async findOne(id: string) {
    const plantilla = await this.prisma.plantillaMensaje.findUnique({ where: { id } });
    if (!plantilla) throw new NotFoundException(`Plantilla no encontrada`);
    return plantilla;
  }

  async update(id: string, dto: UpdatePlantillasMensajeDto) {
    const plantilla = await this.prisma.plantillaMensaje.findUnique({ where: { id } });
    if (!plantilla) throw new NotFoundException(`Plantilla no encontrada`);
    return this.prisma.plantillaMensaje.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const plantilla = await this.prisma.plantillaMensaje.findUnique({ where: { id } });
    if (!plantilla) throw new NotFoundException(`Plantilla no encontrada`);
    return this.prisma.plantillaMensaje.delete({ where: { id } });
  }
}
