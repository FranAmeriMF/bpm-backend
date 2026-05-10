import { PrismaService } from '../prisma/prisma.service';
import { EvaluarSeccionDto } from './dto/evaluar-seccion.dto';
export declare class EvaluacionesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    evaluarSeccion(dto: EvaluarSeccionDto): Promise<{
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
    }>;
    getEvaluacionesByTramite(tramite_id: string): Promise<({
        seccion: {
            id: string;
            titulo: string;
            orden: number;
        };
        asignacion_oficina: {
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
    })[]>;
    getProgreso(asignacion_id: string): Promise<{
        asignacion_id: string;
        total_secciones: number;
        evaluadas: number;
        aprobadas: number;
        rechazadas: number;
        porcentaje: number;
        completada: boolean;
        detalle: {
            seccion_id: string;
            titulo: string;
            orden: number;
            aprobada: boolean;
            motivo_rechazo: string | null;
        }[];
    }>;
    updateEvaluacion(id: string, dto: EvaluarSeccionDto): Promise<{
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
    }>;
    getEvaluacionById(id: string): Promise<{
        seccion: {
            id: string;
            titulo: string;
            orden: number;
        };
        asignacion_oficina: {
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
    }>;
}
