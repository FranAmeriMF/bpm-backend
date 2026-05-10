export declare enum TipoCampo {
    text = "text",
    textarea = "textarea",
    number = "number",
    date = "date",
    select = "select",
    checkbox_group = "checkbox_group",
    radio = "radio",
    file = "file",
    checkbox = "checkbox"
}
export declare class CreateCampoDto {
    nombre: string;
    etiqueta: string;
    tipo: TipoCampo;
    obligatorio?: boolean;
    placeholder?: string;
    descripcion?: string;
    valor_defecto?: any;
    opciones?: string[];
    validaciones?: {
        min_length?: number;
        max_length?: number;
        min?: number;
        max?: number;
        permitir_decimales?: boolean;
        formato_moneda?: boolean;
        tipos_archivo?: string[];
        multiples_archivos?: boolean;
        min_seleccionados?: number;
        max_seleccionados?: number;
    };
}
