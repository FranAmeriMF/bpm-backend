import { EmpresaStatus } from '@prisma/client';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaConDirectorDto } from './dto/create-empresa-con-director.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { QueryEmpresasDto } from './dto/query-empresas.dto';
export declare class EmpresasController {
    private readonly empresasService;
    constructor(empresasService: EmpresasService);
    create(dto: CreateEmpresaConDirectorDto): Promise<{
        empresa: {
            director: {
                id: string;
                nombre: string;
                email: string;
                apellido: string;
            } | null;
        } & {
            id: string;
            estado: import("@prisma/client").$Enums.EmpresaStatus;
            email: string;
            fecha_creacion: Date;
            telefono: string | null;
            fecha_actualizacion: Date;
            razon_social: string;
            nombre_fantasia: string | null;
            cuit: string;
            direccion: string;
            director_id: string | null;
        };
        director: {
            id: string;
            nombre: string;
            estado: import("@prisma/client").$Enums.UserStatus;
            email: string;
            fecha_creacion: Date;
            apellido: string;
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
        };
    }>;
    findAll(query: QueryEmpresasDto): Promise<{
        data: ({
            director: {
                id: string;
                nombre: string;
                email: string;
                apellido: string;
            } | null;
        } & {
            id: string;
            estado: import("@prisma/client").$Enums.EmpresaStatus;
            email: string;
            fecha_creacion: Date;
            telefono: string | null;
            fecha_actualizacion: Date;
            razon_social: string;
            nombre_fantasia: string | null;
            cuit: string;
            direccion: string;
            director_id: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        director: {
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
        } | null;
        usuarios: {
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
        tramites: {
            id: string;
            estado: import("@prisma/client").$Enums.TramiteEstado;
            fecha_creacion: Date;
            empresa_id: string;
            oficina_empresa_id: string | null;
            tipo_tramite_id: string;
            numero: string;
            solicitante_id: string;
            jefe_decisor_id: string | null;
            fecha_envio_director: Date | null;
            fecha_aprobacion_director: Date | null;
            fecha_asignacion: Date | null;
            fecha_revision_final: Date | null;
            fecha_decision_final: Date | null;
            fecha_finalizacion: Date | null;
            observaciones_director: string | null;
            aprobado_por_director: boolean | null;
        }[];
    } & {
        id: string;
        estado: import("@prisma/client").$Enums.EmpresaStatus;
        email: string;
        fecha_creacion: Date;
        telefono: string | null;
        fecha_actualizacion: Date;
        razon_social: string;
        nombre_fantasia: string | null;
        cuit: string;
        direccion: string;
        director_id: string | null;
    }>;
    getEstadisticas(id: string): Promise<{
        total_tramites: number;
        total_usuarios: number;
        por_estado: Record<string, number>;
    }>;
    getUsuarios(id: string): Promise<{
        id: string;
        nombre: string;
        estado: import("@prisma/client").$Enums.UserStatus;
        email: string;
        apellido: string;
        rol: import("@prisma/client").$Enums.UserRole;
        cargo: string | null;
    }[]>;
    getTramites(id: string, estado?: string): Promise<({
        solicitante: {
            id: string;
            nombre: string;
            apellido: string;
        };
        tipo_tramite: {
            id: string;
            nombre: string;
            descripcion: string;
            codigo: string;
            estado: import("@prisma/client").$Enums.TipoTramiteStatus;
            fecha_creacion: Date;
            version: number;
            modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
        };
    } & {
        id: string;
        estado: import("@prisma/client").$Enums.TramiteEstado;
        fecha_creacion: Date;
        empresa_id: string;
        oficina_empresa_id: string | null;
        tipo_tramite_id: string;
        numero: string;
        solicitante_id: string;
        jefe_decisor_id: string | null;
        fecha_envio_director: Date | null;
        fecha_aprobacion_director: Date | null;
        fecha_asignacion: Date | null;
        fecha_revision_final: Date | null;
        fecha_decision_final: Date | null;
        fecha_finalizacion: Date | null;
        observaciones_director: string | null;
        aprobado_por_director: boolean | null;
    })[]>;
    update(id: string, dto: UpdateEmpresaDto): Promise<{
        id: string;
        estado: import("@prisma/client").$Enums.EmpresaStatus;
        email: string;
        fecha_creacion: Date;
        telefono: string | null;
        fecha_actualizacion: Date;
        razon_social: string;
        nombre_fantasia: string | null;
        cuit: string;
        direccion: string;
        director_id: string | null;
    }>;
    changeStatus(id: string, estado: EmpresaStatus): Promise<{
        id: string;
        estado: import("@prisma/client").$Enums.EmpresaStatus;
        email: string;
        fecha_creacion: Date;
        telefono: string | null;
        fecha_actualizacion: Date;
        razon_social: string;
        nombre_fantasia: string | null;
        cuit: string;
        direccion: string;
        director_id: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        estado: import("@prisma/client").$Enums.EmpresaStatus;
        email: string;
        fecha_creacion: Date;
        telefono: string | null;
        fecha_actualizacion: Date;
        razon_social: string;
        nombre_fantasia: string | null;
        cuit: string;
        direccion: string;
        director_id: string | null;
    }>;
}
