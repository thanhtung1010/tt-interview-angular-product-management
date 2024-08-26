
export class ProductModel {
  name: string = '';
  category: string = '';
  type: string = '';
  pageNumber = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  constructor(data: ProductModel | null) {
    if (data) {
      this.checkForString('name', data.name);
      this.checkForString('category', data.category);
      this.checkForString('type', data.type);
      this.checkForNumber('pageNumber', data.pageNumber);
      this.checkForNumber('pageSize', data.pageSize);
      this.checkForNumber('totalPages', data.totalPages);
      this.checkForNumber('totalElements', data.totalElements);
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

  private checkForString(param: 'name' | 'category' | 'type', value: any) {
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
        if (value !== null && value !== undefined && typeof value !== typeCompareValue) {
          cleanedObj[key] = this.removeEmptyValues(value); // Recursively clean nested objects
        }
      }
    }
    return cleanedObj;
  }
}
