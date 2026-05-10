export declare function paginationParams(page?: number, limit?: number): {
    skip: number;
    take: number;
};
export declare function paginar<T>(data: T[], total: number, page: number, limit: number): {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
