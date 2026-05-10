import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOficinaEmpresaDto } from './dto/create-oficina-empresa.dto';
import { UpdateOficinaEmpresaDto } from './dto/update-oficina-empresa.dto';

@Injectable()
export class OficinasEmpresaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(empresa_id: string, dto: CreateOficinaEmpresaDto) {
    return this.prisma.oficinaEmpresa.create({
      data: { ...dto, empresa_id },
    });
  }

  async findAll(empresa_id: string) {
    return this.prisma.oficinaEmpresa.findMany({
      where: { empresa_id },
      include: { usuarios: { select: { id: true, nombre: true, apellido: true, email: true, rol: true } } },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    const oficina = await this.prisma.oficinaEmpresa.findUnique({
      where: { id },
      include: {
        empresa: { select: { id: true, razon_social: true } },
        usuarios: { select: { id: true, nombre: true, apellido: true, email: true, rol: true, estado: true } },
      },
    });
    if (!oficina) throw new NotFoundException('Oficina de empresa no encontrada');
    return oficina;
  }

  async update(id: string, dto: UpdateOficinaEmpresaDto) {
    await this.findOne(id);
    return this.prisma.oficinaEmpresa.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.oficinaEmpresa.delete({ where: { id } });
  }

  async asignarUsuario(id: string, usuario_id: string, director_empresa_id: string) {
    const oficina = await this.findOne(id);

    // Verificar que el director pertenece a la misma empresa
    const director = await this.prisma.user.findUnique({ where: { id: director_empresa_id } });
    if (director?.empresa_id !== oficina.empresa_id) {
      throw new ForbiddenException('Solo el director de la empresa puede asignar usuarios a sus oficinas');
    }

    return this.prisma.user.update({
      where: { id: usuario_id },
      data: { oficina_empresa_id: id },
      select: { id: true, nombre: true, apellido: true, email: true, rol: true, oficina_empresa_id: true },
    });
  }

  async desasignarUsuario(id: string, usuario_id: string) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id: usuario_id },
      data: { oficina_empresa_id: null },
      select: { id: true, nombre: true, apellido: true, email: true, rol: true },
    });
  }
}
