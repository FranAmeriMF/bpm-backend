export interface RequestUser {
    id: string;
    email: string;
    rol: string;
    oficina_id?: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
