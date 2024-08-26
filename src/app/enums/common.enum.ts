import { IPagination } from "@interfaces";

export const PAGINATION_FIELD: Array<keyof IPagination | string> = ['pageNumber', 'pageSize', 'totalElements', 'totalPages'];
