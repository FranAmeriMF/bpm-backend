import { ReportesService } from './reportes.service';
import type { RequestUser } from '../auth/decorators/current-user.decorator';
export declare class ReportesController {
    private readonly reportesService;
    constructor(reportesService: ReportesService);
    getDashboard(): Promise<{
        total_tramites: number;
        nuevos_esta_semana: number;
        total_empresas_activas: number;
        total_usuarios_activos: number;
        por_estado: {
            estado: import("@prisma/client").$Enums.TramiteEstado;
            cantidad: number;
        }[];
    }>;
    getTramitesPorEstado(fecha_desde?: string, fecha_hasta?: string): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.TramiteGroupByOutputType, "estado"[]> & {
        _count: {
            id: number;
        };
    })[]>;
    getDesempenoOficinas(): Promise<{
        oficina_id: string;
        nombre: string;
        total_asignaciones: number;
        completadas: number;
        pendientes: number;
        tiempo_promedio_horas: string | null;
    }[]>;
    getDesempenoDecisor(user: RequestUser): Promise<{
        total: number;
        aprobados: number;
        rechazados: number;
        observados: number;
        tasa_aprobacion: string;
    }>;
    getReporteEmpresa(id: string): Promise<{
        empresa_id: string;
        total: number;
        por_estado: Record<string, number>;
        tramites: ({
            tipo_tramite: {
                nombre: string;
            };
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
    }>;
}
