export type TABLE_ELEMENT_FIELD_TYPE = "text" | "dateTime" | "date" | "number" | "float" | "statusType" | "checkbox"
| "select" | "object" | "array" | "translate" | "hasChildColumn" | "view" | "action";

export interface ITableElement<T> {
  field: T;
  title: string;

  fieldType?: TABLE_ELEMENT_FIELD_TYPE;

  child?: ITableElement<T>[];
  index?: number;
  sortField?: string;
  get?: Function;
  colSpan?: number;
  rowSpan?: number;
  translateTitle?: boolean;
  width?: number | string | null;
  align?: 'center' | 'right' | 'left';
  padding?: string;

  isUnix?: boolean;

  value?: any;
  show?: boolean;
  notAllowHide?: boolean;
  showCCOrAdmin?: boolean;
  showBum?: boolean;
  sortOrder?: string;
  isHide?: boolean;
  nzLeft?: boolean;
  nzRight?: boolean;
  country?: string;
  separator?: string; // Specifies a string to separate each pair of adjacent elements of the array - fieldType = array
}

export interface ITableLayout {
  showDefaultBtn?: boolean,
  showPagination?: boolean;
  showExpand?: boolean;
  showSearch?: boolean;
}

export interface IPagination {
  pageNumber: number,
  pageSize: number;
  totalPages: number;
  totalElements?: number;
}
