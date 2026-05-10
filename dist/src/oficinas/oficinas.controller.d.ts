import { OficinasService } from './oficinas.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { QueryOficinasDto } from './dto/query-oficinas.dto';
export declare class OficinasController {
    private readonly oficinasService;
    constructor(oficinasService: OficinasService);
    create(dto: CreateOficinaDto): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        codigo: string;
        estado: import("@prisma/client").$Enums.OficinaStatus;
        email: string | null;
        permite_decision_final: boolean;
        fecha_creacion: Date;
    }>;
    findAll(query: QueryOficinasDto): Promise<{
        data: {
            id: string;
            nombre: string;
            descripcion: string | null;
            codigo: string;
            estado: import("@prisma/client").$Enums.OficinaStatus;
            email: string | null;
            permite_decision_final: boolean;
            fecha_creacion: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        jefes: {
            id: string;
            nombre: string;
            estado: import("@prisma/client").$Enums.UserStatus;
            email: string;
            fecha_creacion: Date;
            apellido: string;
            password: string;
            dni: string;
            telefono: string | null;
            rol: import("@prisma/client").$Enums.UserRole;
            cargo: string | null;
            requiere_cambio_password: boolean;
            fecha_actualizacion: Date;
            ultimo_acceso: Date | null;
            empresa_id: string | null;
            oficina_id: string | null;
            oficina_empresa_id: string | null;
        }[];
    } & {
        id: string;
        nombre: string;
        descripcion: string | null;
        codigo: string;
        estado: import("@prisma/client").$Enums.OficinaStatus;
        email: string | null;
        permite_decision_final: boolean;
        fecha_creacion: Date;
    }>;
    getJefes(id: string): Promise<{
        id: string;
        nombre: string;
        estado: import("@prisma/client").$Enums.UserStatus;
        email: string;
        apellido: string;
        rol: import("@prisma/client").$Enums.UserRole;
        cargo: string | null;
    }[]>;
    update(id: string, dto: UpdateOficinaDto): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        codigo: string;
        estado: import("@prisma/client").$Enums.OficinaStatus;
        email: string | null;
        permite_decision_final: boolean;
        fecha_creacion: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        codigo: string;
        estado: import("@prisma/client").$Enums.OficinaStatus;
        email: string | null;
        permite_decision_final: boolean;
        fecha_creacion: Date;
    }>;
}
