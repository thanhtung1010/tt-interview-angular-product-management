import { FormControl } from "@angular/forms";
import { PRODUCT_CATEGORY, PRODUCT_TYPE } from "@enums";
import { IBaseItemFromFirebase } from "./firebase.interface";

export interface IProduct {
  id: string;
  name: string;
  category: PRODUCT_CATEGORY;
  type: PRODUCT_TYPE;
  price: number;
  detail?: string;
  img?: string;
}

export interface IProductFromFirebase extends IProduct, IBaseItemFromFirebase {
  select?: boolean;
}

export interface ICategory {
  id: string;
  code: PRODUCT_CATEGORY;
  label: string;
}

export interface IType {
  id: string;
  category: PRODUCT_CATEGORY;
  code: PRODUCT_TYPE,
  label: string;
}

export interface IGroupTypeByCategory {
  category: PRODUCT_CATEGORY;
  types: Array<IType>;
}

export interface IAddProduct {
  name: FormControl<string | null>;
  category: FormControl<string | null>;
  type: FormControl<string | null>;
  price: FormControl<number | null>;
  detail: FormControl<string | null>;
  img: FormControl<string | null>;
}

export type PRODUCT_FIELD =  'name' | 'category' | 'type' | 'price' | 'detail' | 'img' | 'createdAt' | 'updatedAt' | 'select' | 'action';
