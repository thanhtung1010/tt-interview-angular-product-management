import { FormControl } from "@angular/forms";
import { PRODUCT_CATEGORY, PRODUCT_TYPE } from "@enums";

export interface IProduct {
  id: string;
  name: string;
  category: PRODUCT_CATEGORY;
  type: PRODUCT_TYPE;
  price: number;
  detail?: string;
  img?: string;
}

export interface IProductType {
  category: PRODUCT_CATEGORY;
  types: Array<PRODUCT_TYPE>;
}

export interface IAddProduct {
  name: FormControl<string | null>;
  category: FormControl<string | null>;
  type: FormControl<string | null>;
  price: FormControl<number | null>;
  detail: FormControl<string | null>;
  img: FormControl<string | null>;
}
