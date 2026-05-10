import { CreatePlantillasMensajeDto } from './dto/create-plantillas-mensaje.dto';
import { UpdatePlantillasMensajeDto } from './dto/update-plantillas-mensaje.dto';
import { QueryPlantillasDto } from './dto/query-plantillas.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class PlantillasMensajeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePlantillasMensajeDto): Promise<{
        id: string;
        nombre: string;
        estado: import("@prisma/client").$Enums.PlantillaEstado;
        fecha_creacion: Date;
        oficina_id: string;
        tipo_decision: import("@prisma/client").$Enums.DecisionTipo;
        contenido: string;
        creada_por: string | null;
    }>;
    findAll(query: QueryPlantillasDto): Promise<{
        data: ({
            oficina: {
                id: string;
                nombre: string;
            };
        } & {
            id: string;
            nombre: string;
            estado: import("@prisma/client").$Enums.PlantillaEstado;
            fecha_creacion: Date;
            oficina_id: string;
            tipo_decision: import("@prisma/client").$Enums.DecisionTipo;
            contenido: string;
            creada_por: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        nombre: string;
        estado: import("@prisma/client").$Enums.PlantillaEstado;
        fecha_creacion: Date;
        oficina_id: string;
        tipo_decision: import("@prisma/client").$Enums.DecisionTipo;
        contenido: string;
        creada_por: string | null;
    }>;
    update(id: string, dto: UpdatePlantillasMensajeDto): Promise<{
        id: string;
        nombre: string;
        estado: import("@prisma/client").$Enums.PlantillaEstado;
        fecha_creacion: Date;
        oficina_id: string;
        tipo_decision: import("@prisma/client").$Enums.DecisionTipo;
        contenido: string;
        creada_por: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        nombre: string;
        estado: import("@prisma/client").$Enums.PlantillaEstado;
        fecha_creacion: Date;
        oficina_id: string;
        tipo_decision: import("@prisma/client").$Enums.DecisionTipo;
        contenido: string;
        creada_por: string | null;
    }>;
}
