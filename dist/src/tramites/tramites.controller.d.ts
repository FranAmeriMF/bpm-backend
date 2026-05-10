import { TramitesService } from './tramites.service';
import { ArchivosService } from '../archivos/archivos.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { RechazarDirectorDto } from './dto/rechazar-director.dto';
import { AsignarTramiteDto } from './dto/asignar-tramite.dto';
import { DecisionFinalDto } from './dto/decision-final.dto';
import { ReenviarTramiteDto } from './dto/reenviar-tramite.dto';
import { QueryTramitesDto } from './dto/query-tramites.dto';
import type { RequestUser } from '../auth/decorators/current-user.decorator';
export declare class TramitesController {
    private readonly tramitesService;
    private readonly archivosService;
    constructor(tramitesService: TramitesService, archivosService: ArchivosService);
    create(dto: CreateTramiteDto): Promise<{
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
    }>;
    findAll(query: QueryTramitesDto, user: RequestUser): Promise<{
        data: ({
            empresa: {
                id: string;
                razon_social: string;
            };
            solicitante: {
                id: string;
                nombre: string;
                apellido: string;
            };
            tipo_tramite: {
                id: string;
                nombre: string;
                codigo: string;
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getEstadisticas(): Promise<{
        por_estado: Record<string, number>;
        total: number;
    }>;
    findOne(id: string): Promise<{
        empresa: {
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
        historial_datos: {
            id: string;
            tramite_id: string;
            usuario_id: string | null;
            accion: string;
            datos: import("@prisma/client/runtime/client").JsonValue;
            fecha: Date;
        }[];
        solicitante: {
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
        };
        tipo_tramite: {
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
        };
        archivos: {
            id: string;
            seccion_id: string | null;
            tramite_id: string;
            nombre_original: string;
            nombre_archivo: string;
            ruta: string;
            tipo_mime: string | null;
            tamano_bytes: bigint | null;
            fecha_subida: Date;
            subido_por: string | null;
        }[];
        jefe_decisor: {
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
        asignaciones_oficinas: ({
            oficina: {
                id: string;
                nombre: string;
            };
            jefe_asignado: {
                id: string;
                nombre: string;
                apellido: string;
            } | null;
            evaluaciones_secciones: ({
                seccion: {
                    id: string;
                    titulo: string;
                    orden: number;
                };
                evaluador: {
                    id: string;
                    nombre: string;
                    apellido: string;
                };
            } & {
                id: string;
                seccion_id: string;
                asignacion_oficina_id: string;
                aprobada: boolean;
                motivo_rechazo: string | null;
                fecha_evaluacion: Date;
                evaluado_por: string;
            })[];
        } & {
            id: string;
            estado: import("@prisma/client").$Enums.AsignacionEstado;
            oficina_id: string;
            fecha_asignacion: Date;
            fecha_finalizacion: Date | null;
            tramite_id: string;
            jefe_asignado_id: string | null;
            es_decisor: boolean;
            fecha_inicio_revision: Date | null;
        })[];
        historial: ({
            usuario: {
                id: string;
                nombre: string;
                email: string;
                apellido: string;
                rol: import("@prisma/client").$Enums.UserRole;
            } | null;
        } & {
            id: string;
            estado_anterior: string | null;
            estado_nuevo: string;
            comentario: string | null;
            fecha_cambio: Date;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            tramite_id: string;
            usuario_id: string | null;
        })[];
        decision_final: {
            id: string;
            jefe_decisor_id: string;
            decision: import("@prisma/client").$Enums.DecisionTipo;
            secciones_a_corregir: import("@prisma/client/runtime/client").JsonValue | null;
            mensaje_al_solicitante: string;
            plantilla_usada_id: string | null;
            tramite_id: string;
            fecha_decision: Date;
            ip_decisor: string | null;
        } | null;
        secciones_datos: ({
            campos: ({
                campo: {
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
                };
            } & {
                id: string;
                campo_id: string;
                valor: import("@prisma/client/runtime/client").JsonValue | null;
                tramite_seccion_id: string;
            })[];
            seccion: {
                id: string;
                descripcion: string | null;
                fecha_creacion: Date;
                titulo: string;
                orden: number;
                tipo_tramite_id: string;
            };
        } & {
            id: string;
            seccion_id: string;
            tramite_id: string;
        })[];
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
    }>;
    getArchivos(id: string): import("@prisma/client").Prisma.PrismaPromise<({
        seccion: {
            id: string;
            titulo: string;
            orden: number;
        } | null;
    } & {
        id: string;
        seccion_id: string | null;
        tramite_id: string;
        nombre_original: string;
        nombre_archivo: string;
        ruta: string;
        tipo_mime: string | null;
        tamano_bytes: bigint | null;
        fecha_subida: Date;
        subido_por: string | null;
    })[]>;
    update(id: string, dto: UpdateTramiteDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    enviarDirector(id: string, user: RequestUser): Promise<{
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
    }>;
    aprobarDirector(id: string, user: RequestUser): Promise<{
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
    }>;
    rechazarDirector(id: string, user: RequestUser, dto: RechazarDirectorDto): Promise<{
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
    }>;
    asignar(id: string, user: RequestUser, dto: AsignarTramiteDto): Promise<{
        tramite: {
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
        };
    }>;
    iniciarRevision(id: string, user: RequestUser): Promise<{
        id: string;
        estado: import("@prisma/client").$Enums.AsignacionEstado;
        oficina_id: string;
        fecha_asignacion: Date;
        fecha_finalizacion: Date | null;
        tramite_id: string;
        jefe_asignado_id: string | null;
        es_decisor: boolean;
        fecha_inicio_revision: Date | null;
    }>;
    finalizarRevision(id: string, user: RequestUser): Promise<{
        mensaje: string;
    }>;
    decisionFinal(id: string, user: RequestUser, dto: DecisionFinalDto): Promise<{
        decision: {
            id: string;
            jefe_decisor_id: string;
            decision: import("@prisma/client").$Enums.DecisionTipo;
            secciones_a_corregir: import("@prisma/client/runtime/client").JsonValue | null;
            mensaje_al_solicitante: string;
            plantilla_usada_id: string | null;
            tramite_id: string;
            fecha_decision: Date;
            ip_decisor: string | null;
        };
        estado: import("@prisma/client").$Enums.TramiteEstado;
    }>;
    iniciarCorreccion(id: string, user: RequestUser): Promise<{
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
    }>;
    reenviar(id: string, user: RequestUser, dto: ReenviarTramiteDto): Promise<{
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
    }>;
}
