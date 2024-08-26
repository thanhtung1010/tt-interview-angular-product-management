import { DEFAULT_SORT_FIELD, PAGINATION_FIELD } from "@enums";

export class ProductModel {
  name: string = '';
  category: string = '';
  type: string = '';
  pageNumber = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  sort: string = DEFAULT_SORT_FIELD;
  direction: null | 'asc' | 'desc' = 'asc';

  constructor(data: ProductModel | null) {
    if (data) {
      this.checkForString('name', data.name);
      this.checkForString('category', data.category);
      this.checkForString('type', data.type);
      this.checkForString('sort', data.sort);
      this.checkForNumber('pageNumber', data.pageNumber);
      this.checkForNumber('pageSize', data.pageSize);
      this.checkForNumber('totalPages', data.totalPages);
      this.checkForNumber('totalElements', data.totalElements);

      this.direction = data.direction === undefined ?  'asc' : data.direction;
    }
  }

  private checkForNumber(
    param: 'pageNumber' | 'pageSize' | 'totalPages' | 'totalElements',
    value: any,
    keepZero = false
  ) {
    if (typeof value === 'number' || !Number.isNaN(+value) || value === null) {
      this[param] = +value;
    }
  }

  private checkForString(param: 'name' | 'category' | 'type' | 'sort', value: any) {
    if (typeof value === 'string') {
      this[param] = value;
    }
  }

  get getAPIParams(): Record<string, any> {
    return this.removeEmptyValues({...this});
  }

  get getURLParams(): Record<string, any> {
    return this.removeEmptyValues({...this}, 'number');
  }

  private removeEmptyValues(obj: Record<string, any>, typeCompareValue: string = 'undefined'): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj; // Return non-object values as is
    }

    const cleanedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (!PAGINATION_FIELD.includes(key)) {
          cleanedObj[key] = this.removeEmptyValues(value); // Recursively clean nested objects
        }
      }
    }
    return cleanedObj;
  }
}
