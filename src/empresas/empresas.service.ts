import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EmpresaStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { QueryEmpresasDto } from './dto/query-empresas.dto';
import { CreateEmpresaConDirectorDto } from './dto/create-empresa-con-director.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { paginar, paginationParams } from '../common/helpers/paginate.helper';

function generarPasswordTemporal(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

@Injectable()
export class EmpresasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async create(dto: CreateEmpresaConDirectorDto) {
    const { director: directorDto, ...empresaData } = dto;

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email: directorDto.email }, { dni: directorDto.dni }] },
    });
    if (existingUser) {
      throw new BadRequestException('Ya existe un usuario con ese email o DNI.');
    }

    const passwordTemporal = generarPasswordTemporal();
    const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Crear empresa sin director aún
      const empresa = await tx.empresa.create({ data: empresaData });

      // 2. Crear usuario director enlazado a la empresa
      const director = await tx.user.create({
        data: {
          ...directorDto,
          password: hashedPassword,
          rol: 'director',
          requiere_cambio_password: true,
          empresa_id: empresa.id,
        },
      });

      // 3. Enlazar empresa → director
      const empresaFinal = await tx.empresa.update({
        where: { id: empresa.id },
        data: { director_id: director.id },
        include: {
          director: { select: { id: true, nombre: true, apellido: true, email: true } },
        },
      });

      const { password: _pw, ...directorSafe } = director;
      return { empresa: empresaFinal, director: directorSafe };
    });

    // Email fuera de la transacción — fallo de mail no revierte la creación
    void this.mail.enviarBienvenida(
      directorDto.email,
      `${directorDto.nombre} ${directorDto.apellido}`,
      passwordTemporal,
    );

    return result;
  }

  async findAll(query: QueryEmpresasDto) {
    const { page = 1, limit = 20, estado, buscar } = query;
    const { skip, take } = paginationParams(page, limit);

    const where: any = {};
    if (estado) where.estado = estado;
    if (buscar) {
      where.OR = [
        { razon_social: { contains: buscar, mode: 'insensitive' } },
        { nombre_fantasia: { contains: buscar, mode: 'insensitive' } },
        { cuit: { contains: buscar } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.empresa.findMany({
        where, skip, take,
        include: { director: { select: { id: true, nombre: true, apellido: true, email: true } } },
        orderBy: { razon_social: 'asc' },
      }),
      this.prisma.empresa.count({ where }),
    ]);

    return paginar(data, total, page, limit);
  }

  async findOne(id: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
      include: { director: true, usuarios: true, tramites: true },
    });
    if (!empresa) throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    return empresa;
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });
    if (!empresa) throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    return this.prisma.empresa.update({ where: { id }, data: updateEmpresaDto });
  }

  async remove(id: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });
    if (!empresa) throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    return this.prisma.empresa.delete({ where: { id } });
  }

  async changeStatus(id: string, estado: EmpresaStatus) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });
    if (!empresa) throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    return this.prisma.empresa.update({ where: { id }, data: { estado } });
  }

  async getEstadisticas(id: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });
    if (!empresa) throw new NotFoundException(`Empresa con ID ${id} no encontrada`);

    const [tramitesGrupo, totalUsuarios] = await Promise.all([
      this.prisma.tramite.groupBy({
        by: ['estado'],
        where: { empresa_id: id },
        _count: { _all: true },
      }),
      this.prisma.user.count({ where: { empresa_id: id } }),
    ]);

    const por_estado: Record<string, number> = {};
    let totalTramites = 0;
    for (const g of tramitesGrupo) {
      por_estado[g.estado] = g._count._all;
      totalTramites += g._count._all;
    }

    return { total_tramites: totalTramites, total_usuarios: totalUsuarios, por_estado };
  }

  async getUsuarios(id: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });
    if (!empresa) throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    return this.prisma.user.findMany({
      where: { empresa_id: id },
      select: { id: true, nombre: true, apellido: true, email: true, rol: true, estado: true, cargo: true },
    });
  }

  async getTramites(id: string, estado?: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });
    if (!empresa) throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    const where: any = { empresa_id: id };
    if (estado) where.estado = estado;
    return this.prisma.tramite.findMany({
      where,
      include: { tipo_tramite: true, solicitante: { select: { id: true, nombre: true, apellido: true } } },
      orderBy: { fecha_creacion: 'desc' },
    });
  }
}
