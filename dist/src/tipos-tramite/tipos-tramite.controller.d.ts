import { TiposTramiteService } from './tipos-tramite.service';
import { CreateTiposTramiteDto } from './dto/create-tipos-tramite.dto';
import { UpdateTiposTramiteDto } from './dto/update-tipos-tramite.dto';
import { QueryTiposTramiteDto } from './dto/query-tipos-tramite.dto';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';
import { CreateCampoDto } from './dto/create-campo.dto';
import { UpdateCampoDto } from './dto/update-campo.dto';
import { SetModoAsignacionDto } from './dto/set-modo-asignacion.dto';
export declare class TiposTramiteController {
    private readonly tiposTramiteService;
    constructor(tiposTramiteService: TiposTramiteService);
    create(dto: CreateTiposTramiteDto): Promise<{
        id: string;
        nombre: string;
        descripcion: string;
        codigo: string;
        estado: import("@prisma/client").$Enums.TipoTramiteStatus;
        fecha_creacion: Date;
        version: number;
        modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
    }>;
    findAll(query: QueryTiposTramiteDto): Promise<{
        data: ({
            _count: {
                tramites: number;
                secciones: number;
            };
        } & {
            id: string;
            nombre: string;
            descripcion: string;
            codigo: string;
            estado: import("@prisma/client").$Enums.TipoTramiteStatus;
            fecha_creacion: Date;
            version: number;
            modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        secciones: ({
            campos: {
                id: string;
                nombre: string;
                descripcion: string | null;
                fecha_creacion: Date;
                orden: number;
                tipo: import("@prisma/client").$Enums.TipoCampo;
                etiqueta: string;
                obligatorio: boolean;
                placeholder: string | null;
                valor_defecto: import("@prisma/client/runtime/client").JsonValue | null;
                opciones: import("@prisma/client/runtime/client").JsonValue | null;
                validaciones: import("@prisma/client/runtime/client").JsonValue | null;
                seccion_id: string;
            }[];
        } & {
            id: string;
            descripcion: string | null;
            fecha_creacion: Date;
            titulo: string;
            orden: number;
            tipo_tramite_id: string;
        })[];
        oficinas_asignacion: ({
            oficina: {
                id: string;
                nombre: string;
                codigo: string;
            };
        } & {
            oficina_id: string;
            tipo_tramite_id: string;
        })[];
    } & {
        id: string;
        nombre: string;
        descripcion: string;
        codigo: string;
        estado: import("@prisma/client").$Enums.TipoTramiteStatus;
        fecha_creacion: Date;
        version: number;
        modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
    }>;
    update(id: string, dto: UpdateTiposTramiteDto): Promise<{
        secciones: ({
            campos: {
                id: string;
                nombre: string;
                descripcion: string | null;
                fecha_creacion: Date;
                orden: number;
                tipo: import("@prisma/client").$Enums.TipoCampo;
                etiqueta: string;
                obligatorio: boolean;
                placeholder: string | null;
                valor_defecto: import("@prisma/client/runtime/client").JsonValue | null;
                opciones: import("@prisma/client/runtime/client").JsonValue | null;
                validaciones: import("@prisma/client/runtime/client").JsonValue | null;
                seccion_id: string;
            }[];
        } & {
            id: string;
            descripcion: string | null;
            fecha_creacion: Date;
            titulo: string;
            orden: number;
            tipo_tramite_id: string;
        })[];
        oficinas_asignacion: ({
            oficina: {
                id: string;
                nombre: string;
                codigo: string;
            };
        } & {
            oficina_id: string;
            tipo_tramite_id: string;
        })[];
    } & {
        id: string;
        nombre: string;
        descripcion: string;
        codigo: string;
        estado: import("@prisma/client").$Enums.TipoTramiteStatus;
        fecha_creacion: Date;
        version: number;
        modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
    }>;
    remove(id: string): Promise<{
        id: string;
        nombre: string;
        descripcion: string;
        codigo: string;
        estado: import("@prisma/client").$Enums.TipoTramiteStatus;
        fecha_creacion: Date;
        version: number;
        modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
    }>;
    activar(id: string): Promise<{
        secciones: ({
            campos: {
                id: string;
                nombre: string;
                descripcion: string | null;
                fecha_creacion: Date;
                orden: number;
                tipo: import("@prisma/client").$Enums.TipoCampo;
                etiqueta: string;
                obligatorio: boolean;
                placeholder: string | null;
                valor_defecto: import("@prisma/client/runtime/client").JsonValue | null;
                opciones: import("@prisma/client/runtime/client").JsonValue | null;
                validaciones: import("@prisma/client/runtime/client").JsonValue | null;
                seccion_id: string;
            }[];
        } & {
            id: string;
            descripcion: string | null;
            fecha_creacion: Date;
            titulo: string;
            orden: number;
            tipo_tramite_id: string;
        })[];
    } & {
        id: string;
        nombre: string;
        descripcion: string;
        codigo: string;
        estado: import("@prisma/client").$Enums.TipoTramiteStatus;
        fecha_creacion: Date;
        version: number;
        modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
    }>;
    crearNuevaVersion(id: string): Promise<({
        secciones: ({
            campos: {
                id: string;
                nombre: string;
                descripcion: string | null;
                fecha_creacion: Date;
                orden: number;
                tipo: import("@prisma/client").$Enums.TipoCampo;
                etiqueta: string;
                obligatorio: boolean;
                placeholder: string | null;
                valor_defecto: import("@prisma/client/runtime/client").JsonValue | null;
                opciones: import("@prisma/client/runtime/client").JsonValue | null;
                validaciones: import("@prisma/client/runtime/client").JsonValue | null;
                seccion_id: string;
            }[];
        } & {
            id: string;
            descripcion: string | null;
            fecha_creacion: Date;
            titulo: string;
            orden: number;
            tipo_tramite_id: string;
        })[];
    } & {
        id: string;
        nombre: string;
        descripcion: string;
        codigo: string;
        estado: import("@prisma/client").$Enums.TipoTramiteStatus;
        fecha_creacion: Date;
        version: number;
        modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
    }) | null>;
    setModoAsignacion(id: string, dto: SetModoAsignacionDto): Promise<{
        secciones: ({
            campos: {
                id: string;
                nombre: string;
                descripcion: string | null;
                fecha_creacion: Date;
                orden: number;
                tipo: import("@prisma/client").$Enums.TipoCampo;
                etiqueta: string;
                obligatorio: boolean;
                placeholder: string | null;
                valor_defecto: import("@prisma/client/runtime/client").JsonValue | null;
                opciones: import("@prisma/client/runtime/client").JsonValue | null;
                validaciones: import("@prisma/client/runtime/client").JsonValue | null;
                seccion_id: string;
            }[];
        } & {
            id: string;
            descripcion: string | null;
            fecha_creacion: Date;
            titulo: string;
            orden: number;
            tipo_tramite_id: string;
        })[];
        oficinas_asignacion: ({
            oficina: {
                id: string;
                nombre: string;
                codigo: string;
            };
        } & {
            oficina_id: string;
            tipo_tramite_id: string;
        })[];
    } & {
        id: string;
        nombre: string;
        descripcion: string;
        codigo: string;
        estado: import("@prisma/client").$Enums.TipoTramiteStatus;
        fecha_creacion: Date;
        version: number;
        modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
    }>;
    addSeccion(id: string, dto: CreateSeccionDto): Promise<{
        campos: {
            id: string;
            nombre: string;
            descripcion: string | null;
            fecha_creacion: Date;
            orden: number;
            tipo: import("@prisma/client").$Enums.TipoCampo;
            etiqueta: string;
            obligatorio: boolean;
            placeholder: string | null;
            valor_defecto: import("@prisma/client/runtime/client").JsonValue | null;
            opciones: import("@prisma/client/runtime/client").JsonValue | null;
            validaciones: import("@prisma/client/runtime/client").JsonValue | null;
            seccion_id: string;
        }[];
    } & {
        id: string;
        descripcion: string | null;
        fecha_creacion: Date;
        titulo: string;
        orden: number;
        tipo_tramite_id: string;
    }>;
    updateSeccion(id: string, seccion_id: string, dto: UpdateSeccionDto): Promise<{
        campos: {
            id: string;
            nombre: string;
            descripcion: string | null;
            fecha_creacion: Date;
            orden: number;
            tipo: import("@prisma/client").$Enums.TipoCampo;
            etiqueta: string;
            obligatorio: boolean;
            placeholder: string | null;
            valor_defecto: import("@prisma/client/runtime/client").JsonValue | null;
            opciones: import("@prisma/client/runtime/client").JsonValue | null;
            validaciones: import("@prisma/client/runtime/client").JsonValue | null;
            seccion_id: string;
        }[];
    } & {
        id: string;
        descripcion: string | null;
        fecha_creacion: Date;
        titulo: string;
        orden: number;
        tipo_tramite_id: string;
    }>;
    deleteSeccion(id: string, seccion_id: string): Promise<{
        mensaje: string;
    }>;
    reorderSecciones(id: string, ids: string[]): Promise<{
        secciones: ({
            campos: {
                id: string;
                nombre: string;
                descripcion: string | null;
                fecha_creacion: Date;
                orden: number;
                tipo: import("@prisma/client").$Enums.TipoCampo;
                etiqueta: string;
                obligatorio: boolean;
                placeholder: string | null;
                valor_defecto: import("@prisma/client/runtime/client").JsonValue | null;
                opciones: import("@prisma/client/runtime/client").JsonValue | null;
                validaciones: import("@prisma/client/runtime/client").JsonValue | null;
                seccion_id: string;
            }[];
        } & {
            id: string;
            descripcion: string | null;
            fecha_creacion: Date;
            titulo: string;
            orden: number;
            tipo_tramite_id: string;
        })[];
        oficinas_asignacion: ({
            oficina: {
                id: string;
                nombre: string;
                codigo: string;
            };
        } & {
            oficina_id: string;
            tipo_tramite_id: string;
        })[];
    } & {
        id: string;
        nombre: string;
        descripcion: string;
        codigo: string;
        estado: import("@prisma/client").$Enums.TipoTramiteStatus;
        fecha_creacion: Date;
        version: number;
        modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
    }>;
    addCampo(id: string, seccion_id: string, dto: CreateCampoDto): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        fecha_creacion: Date;
        orden: number;
        tipo: import("@prisma/client").$Enums.TipoCampo;
        etiqueta: string;
        obligatorio: boolean;
        placeholder: string | null;
        valor_defecto: import("@prisma/client/runtime/client").JsonValue | null;
        opciones: import("@prisma/client/runtime/client").JsonValue | null;
        validaciones: import("@prisma/client/runtime/client").JsonValue | null;
        seccion_id: string;
    }>;
    updateCampo(id: string, seccion_id: string, campo_id: string, dto: UpdateCampoDto): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        fecha_creacion: Date;
        orden: number;
        tipo: import("@prisma/client").$Enums.TipoCampo;
        etiqueta: string;
        obligatorio: boolean;
        placeholder: string | null;
        valor_defecto: import("@prisma/client/runtime/client").JsonValue | null;
        opciones: import("@prisma/client/runtime/client").JsonValue | null;
        validaciones: import("@prisma/client/runtime/client").JsonValue | null;
        seccion_id: string;
    }>;
    deleteCampo(id: string, seccion_id: string, campo_id: string): Promise<{
        mensaje: string;
    }>;
    reorderCampos(id: string, seccion_id: string, ids: string[]): Promise<{
        secciones: ({
            campos: {
                id: string;
                nombre: string;
                descripcion: string | null;
                fecha_creacion: Date;
                orden: number;
                tipo: import("@prisma/client").$Enums.TipoCampo;
                etiqueta: string;
                obligatorio: boolean;
                placeholder: string | null;
                valor_defecto: import("@prisma/client/runtime/client").JsonValue | null;
                opciones: import("@prisma/client/runtime/client").JsonValue | null;
                validaciones: import("@prisma/client/runtime/client").JsonValue | null;
                seccion_id: string;
            }[];
        } & {
            id: string;
            descripcion: string | null;
            fecha_creacion: Date;
            titulo: string;
            orden: number;
            tipo_tramite_id: string;
        })[];
        oficinas_asignacion: ({
            oficina: {
                id: string;
                nombre: string;
                codigo: string;
            };
        } & {
            oficina_id: string;
            tipo_tramite_id: string;
        })[];
    } & {
        id: string;
        nombre: string;
        descripcion: string;
        codigo: string;
        estado: import("@prisma/client").$Enums.TipoTramiteStatus;
        fecha_creacion: Date;
        version: number;
        modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
    }>;
}
