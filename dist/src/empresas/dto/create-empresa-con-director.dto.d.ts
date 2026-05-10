export declare class NuevoDirectorDto {
    nombre: string;
    apellido: string;
    email: string;
    dni: string;
    telefono?: string;
    cargo?: string;
}
export declare class CreateEmpresaConDirectorDto {
    razon_social: string;
    nombre_fantasia?: string;
    cuit: string;
    direccion: string;
    telefono?: string;
    email: string;
    director: NuevoDirectorDto;
}
