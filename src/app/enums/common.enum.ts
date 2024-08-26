import { IPagination } from "@interfaces";

export const PAGINATION_FIELD: Array<keyof IPagination | string> = ['pageNumber', 'pageSize', 'totalElements', 'totalPages'];
export const UNFILTER_FIELD: Array<string> = ['sort', 'direction'];
