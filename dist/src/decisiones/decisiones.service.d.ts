import { PrismaService } from '../prisma/prisma.service';
import { QueryDecisionesDto } from './dto/query-decisiones.dto';
export declare class DecisionesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPendientes(jefe_decisor_id: string, page?: number, limit?: number): Promise<{
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
                descripcion: string;
                codigo: string;
                estado: import("@prisma/client").$Enums.TipoTramiteStatus;
                fecha_creacion: Date;
                version: number;
                modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
            };
            asignaciones_oficinas: ({
                oficina: {
                    id: string;
                    nombre: string;
                    descripcion: string | null;
                    codigo: string;
                    estado: import("@prisma/client").$Enums.OficinaStatus;
                    email: string | null;
                    permite_decision_final: boolean;
                    fecha_creacion: Date;
                };
                evaluaciones_secciones: {
                    id: string;
                    seccion_id: string;
                    asignacion_oficina_id: string;
                    aprobada: boolean;
                    motivo_rechazo: string | null;
                    fecha_evaluacion: Date;
                    evaluado_por: string;
                }[];
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
    getHistorial(jefe_decisor_id: string, query: QueryDecisionesDto): Promise<{
        data: ({
            tramite: {
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
            };
            plantilla_usada: {
                id: string;
                nombre: string;
            } | null;
        } & {
            id: string;
            jefe_decisor_id: string;
            decision: import("@prisma/client").$Enums.DecisionTipo;
            secciones_a_corregir: import("@prisma/client/runtime/client").JsonValue | null;
            mensaje_al_solicitante: string;
            plantilla_usada_id: string | null;
            tramite_id: string;
            fecha_decision: Date;
            ip_decisor: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getDetalle(id: string): Promise<{
        tramite: {
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
                id: string;
                nombre: string;
                descripcion: string;
                codigo: string;
                estado: import("@prisma/client").$Enums.TipoTramiteStatus;
                fecha_creacion: Date;
                version: number;
                modo_asignacion: import("@prisma/client").$Enums.ModoAsignacion;
            };
            asignaciones_oficinas: ({
                oficina: {
                    id: string;
                    nombre: string;
                    descripcion: string | null;
                    codigo: string;
                    estado: import("@prisma/client").$Enums.OficinaStatus;
                    email: string | null;
                    permite_decision_final: boolean;
                    fecha_creacion: Date;
                };
                evaluaciones_secciones: {
                    id: string;
                    seccion_id: string;
                    asignacion_oficina_id: string;
                    aprobada: boolean;
                    motivo_rechazo: string | null;
                    fecha_evaluacion: Date;
                    evaluado_por: string;
                }[];
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
        };
        jefe_decisor: {
            id: string;
            nombre: string;
            apellido: string;
        };
        plantilla_usada: {
            id: string;
            nombre: string;
            estado: import("@prisma/client").$Enums.PlantillaEstado;
            fecha_creacion: Date;
            oficina_id: string;
            tipo_decision: import("@prisma/client").$Enums.DecisionTipo;
            contenido: string;
            creada_por: string | null;
        } | null;
    } & {
        id: string;
        jefe_decisor_id: string;
        decision: import("@prisma/client").$Enums.DecisionTipo;
        secciones_a_corregir: import("@prisma/client/runtime/client").JsonValue | null;
        mensaje_al_solicitante: string;
        plantilla_usada_id: string | null;
        tramite_id: string;
        fecha_decision: Date;
        ip_decisor: string | null;
    }>;
    getSeguimiento(id: string): Promise<{
        decision: import("@prisma/client").$Enums.DecisionTipo;
        secciones_a_corregir: import("@prisma/client/runtime/client").JsonValue;
        estado_actual: import("@prisma/client").$Enums.TramiteEstado;
        historial: {
            id: string;
            estado_anterior: string | null;
            estado_nuevo: string;
            comentario: string | null;
            fecha_cambio: Date;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            tramite_id: string;
            usuario_id: string | null;
        }[];
        asignaciones: ({
            oficina: {
                id: string;
                nombre: string;
                descripcion: string | null;
                codigo: string;
                estado: import("@prisma/client").$Enums.OficinaStatus;
                email: string | null;
                permite_decision_final: boolean;
                fecha_creacion: Date;
            };
            evaluaciones_secciones: {
                id: string;
                seccion_id: string;
                asignacion_oficina_id: string;
                aprobada: boolean;
                motivo_rechazo: string | null;
                fecha_evaluacion: Date;
                evaluado_por: string;
            }[];
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
    }>;
}
