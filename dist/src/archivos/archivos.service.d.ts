import { PrismaService } from '../prisma/prisma.service';
export declare class ArchivosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        tramite_id: string;
        subido_por?: string;
        seccion_id?: string;
        nombre_original: string;
        nombre_archivo: string;
        ruta: string;
        tipo_mime: string;
        tamano_bytes: bigint;
    }): Promise<{
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
    findOne(id: string): Promise<{
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
    findByTramite(tramite_id: string): import("@prisma/client").Prisma.PrismaPromise<({
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
