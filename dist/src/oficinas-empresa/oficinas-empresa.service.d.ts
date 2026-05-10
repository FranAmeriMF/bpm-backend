import { PrismaService } from '../prisma/prisma.service';
import { CreateOficinaEmpresaDto } from './dto/create-oficina-empresa.dto';
import { UpdateOficinaEmpresaDto } from './dto/update-oficina-empresa.dto';
export declare class OficinasEmpresaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(empresa_id: string, dto: CreateOficinaEmpresaDto): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        estado: import("@prisma/client").$Enums.OficinaEmpresaStatus;
        fecha_creacion: Date;
        telefono: string | null;
        empresa_id: string;
        direccion: string | null;
    }>;
    findAll(empresa_id: string): Promise<({
        usuarios: {
            id: string;
            nombre: string;
            email: string;
            apellido: string;
            rol: import("@prisma/client").$Enums.UserRole;
        }[];
    } & {
        id: string;
        nombre: string;
        descripcion: string | null;
        estado: import("@prisma/client").$Enums.OficinaEmpresaStatus;
        fecha_creacion: Date;
        telefono: string | null;
        empresa_id: string;
        direccion: string | null;
    })[]>;
    findOne(id: string): Promise<{
        empresa: {
            id: string;
            razon_social: string;
        };
        usuarios: {
            id: string;
            nombre: string;
            estado: import("@prisma/client").$Enums.UserStatus;
            email: string;
            apellido: string;
            rol: import("@prisma/client").$Enums.UserRole;
        }[];
    } & {
        id: string;
        nombre: string;
        descripcion: string | null;
        estado: import("@prisma/client").$Enums.OficinaEmpresaStatus;
        fecha_creacion: Date;
        telefono: string | null;
        empresa_id: string;
        direccion: string | null;
    }>;
    update(id: string, dto: UpdateOficinaEmpresaDto): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        estado: import("@prisma/client").$Enums.OficinaEmpresaStatus;
        fecha_creacion: Date;
        telefono: string | null;
        empresa_id: string;
        direccion: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        estado: import("@prisma/client").$Enums.OficinaEmpresaStatus;
        fecha_creacion: Date;
        telefono: string | null;
        empresa_id: string;
        direccion: string | null;
    }>;
    asignarUsuario(id: string, usuario_id: string, director_empresa_id: string): Promise<{
        id: string;
        nombre: string;
        email: string;
        apellido: string;
        rol: import("@prisma/client").$Enums.UserRole;
        oficina_empresa_id: string | null;
    }>;
    desasignarUsuario(id: string, usuario_id: string): Promise<{
        id: string;
        nombre: string;
        email: string;
        apellido: string;
        rol: import("@prisma/client").$Enums.UserRole;
    }>;
}
