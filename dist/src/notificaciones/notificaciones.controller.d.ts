import { NotificacionesService } from './notificaciones.service';
import { QueryNotificacionesDto } from './dto/query-notificaciones.dto';
import type { RequestUser } from '../auth/decorators/current-user.decorator';
export declare class NotificacionesController {
    private readonly notificacionesService;
    constructor(notificacionesService: NotificacionesService);
    findAll(user: RequestUser, query: QueryNotificacionesDto): Promise<{
        data: ({
            tramite: {
                id: string;
                numero: string;
            } | null;
        } & {
            id: string;
            fecha_creacion: Date;
            titulo: string;
            tipo: import("@prisma/client").$Enums.NotificacionTipo;
            tramite_id: string | null;
            usuario_id: string;
            mensaje: string;
            leida: boolean;
            fecha_lectura: Date | null;
            accion_url: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    countNoLeidas(user: RequestUser): Promise<{
        no_leidas: number;
    }>;
    marcarTodasLeidas(user: RequestUser): Promise<{
        mensaje: string;
    }>;
    marcarLeida(id: string): Promise<{
        id: string;
        fecha_creacion: Date;
        titulo: string;
        tipo: import("@prisma/client").$Enums.NotificacionTipo;
        tramite_id: string | null;
        usuario_id: string;
        mensaje: string;
        leida: boolean;
        fecha_lectura: Date | null;
        accion_url: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        fecha_creacion: Date;
        titulo: string;
        tipo: import("@prisma/client").$Enums.NotificacionTipo;
        tramite_id: string | null;
        usuario_id: string;
        mensaje: string;
        leida: boolean;
        fecha_lectura: Date | null;
        accion_url: string | null;
    }>;
}
