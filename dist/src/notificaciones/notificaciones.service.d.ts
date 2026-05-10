import { PrismaService } from '../prisma/prisma.service';
import { QueryNotificacionesDto } from './dto/query-notificaciones.dto';
export declare class NotificacionesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByUsuario(usuario_id: string, query: QueryNotificacionesDto): Promise<{
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
    countNoLeidas(usuario_id: string): Promise<{
        no_leidas: number;
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
    marcarTodasLeidas(usuario_id: string): Promise<{
        mensaje: string;
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
