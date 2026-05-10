import { TramiteSeccionDto } from './tramite-seccion.dto';
export declare class CreateTramiteDto {
    empresa_id: string;
    tipo_tramite_id: string;
    solicitante_id: string;
    oficina_empresa_id?: string;
    secciones?: TramiteSeccionDto[];
}
