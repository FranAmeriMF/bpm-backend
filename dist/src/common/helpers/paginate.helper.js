"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationParams = paginationParams;
exports.paginar = paginar;
function paginationParams(page = 1, limit = 20) {
    return { skip: (page - 1) * limit, take: limit };
}
function paginar(data, total, page, limit) {
    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}
//# sourceMappingURL=paginate.helper.js.map