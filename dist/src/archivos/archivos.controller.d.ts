import type { FastifyRequest, FastifyReply } from 'fastify';
import { ArchivosService } from './archivos.service';
import type { RequestUser } from '../auth/decorators/current-user.decorator';
export declare class ArchivosController {
    private readonly archivosService;
    constructor(archivosService: ArchivosService);
    uploadFile(tramite_id: string, seccion_id: string | undefined, user: RequestUser, req: FastifyRequest): Promise<{
        tamano_bytes: string | undefined;
        id: string;
        seccion_id: string | null;
        tramite_id: string;
        nombre_original: string;
        nombre_archivo: string;
        ruta: string;
        tipo_mime: string | null;
        fecha_subida: Date;
        subido_por: string | null;
    }>;
    download(id: string, res: FastifyReply): Promise<never>;
    remove(id: string): Promise<{
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
    }>;
}
