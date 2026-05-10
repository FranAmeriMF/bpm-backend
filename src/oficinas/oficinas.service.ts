import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { QueryOficinasDto } from './dto/query-oficinas.dto';
import { PrismaService } from '../prisma/prisma.service';
import { paginar, paginationParams } from '../common/helpers/paginate.helper';

@Injectable()
export class OficinasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOficinaDto: CreateOficinaDto) {
    try {
      return await this.prisma.oficina.create({ data: createOficinaDto });
    } catch {
      throw new BadRequestException('No se pudo crear la oficina. Verifique que el código no esté duplicado.');
    }
  }

  async findAll(query: QueryOficinasDto) {
    const { page = 1, limit = 20, estado, permite_decision_final, buscar } = query;
    const { skip, take } = paginationParams(page, limit);

    const where: any = {};
    if (estado) where.estado = estado;
    if (permite_decision_final !== undefined) where.permite_decision_final = permite_decision_final;
    if (buscar) {
      where.OR = [
        { nombre: { contains: buscar, mode: 'insensitive' } },
        { codigo: { contains: buscar, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.oficina.findMany({ where, skip, take, orderBy: { nombre: 'asc' } }),
      this.prisma.oficina.count({ where }),
    ]);

    return paginar(data, total, page, limit);
  }

  async findOne(id: string) {
    const oficina = await this.prisma.oficina.findUnique({
      where: { id },
      include: { jefes: true },
    });
    if (!oficina) throw new NotFoundException(`Oficina con ID ${id} no encontrada`);
    return oficina;
  }

  async update(id: string, updateOficinaDto: UpdateOficinaDto) {
    const oficina = await this.prisma.oficina.findUnique({ where: { id } });
    if (!oficina) throw new NotFoundException(`Oficina con ID ${id} no encontrada`);
    return this.prisma.oficina.update({ where: { id }, data: updateOficinaDto });
  }

  async remove(id: string) {
    const oficina = await this.prisma.oficina.findUnique({ where: { id } });
    if (!oficina) throw new NotFoundException(`Oficina con ID ${id} no encontrada`);
    return this.prisma.oficina.delete({ where: { id } });
  }

  async getJefes(id: string) {
    const oficina = await this.prisma.oficina.findUnique({ where: { id } });
    if (!oficina) throw new NotFoundException(`Oficina con ID ${id} no encontrada`);
    return this.prisma.user.findMany({
      where: { oficina_id: id },
      select: { id: true, nombre: true, apellido: true, email: true, rol: true, estado: true, cargo: true },
    });
  }
}
