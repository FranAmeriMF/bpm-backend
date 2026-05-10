export function paginationParams(page = 1, limit = 20) {
  return { skip: (page - 1) * limit, take: limit };
}

export function paginar<T>(data: T[], total: number, page: number, limit: number) {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
