import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AddProductComponent, ReviewDeleteProductComponent, TableLayoutComponent } from '@components';
import { MinWidthDirective } from '@directives';
import { FIRESTORE_COLLECTION, PRODUCT_CATEGORY } from '@enums';
import { Helpers } from '@helpers';
import {
  ICategory,
  IGroupTypeByCategory,
  IProduct,
  IProductFromFirebase,
  ITableElement,
  ITableLayout,
  IType,
  PRODUCT_FIELD
} from '@interfaces';
import { ProductModel } from '@models';
import { DateTimePipe } from '@pipes';
import { FirebaseService } from '@services';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Component({
  standalone: true,
  selector: 'tt-products',
  templateUrl: './products.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TableLayoutComponent,
    AddProductComponent,
    DateTimePipe,
    MinWidthDirective,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
  ],
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild('addProduct') addProductRef!: ElementRef;

  loading = {
    getProducts: signal(false),
    addProduct: signal(false),
    updateProduct: signal(false),
    getCategory: signal(false),
    getType: signal(false),
  };
  disable = {
    delete: signal(true),
  };
  tableSetting: ITableLayout = {
    showDefaultBtn: true,
  };
  params: ProductModel = new ProductModel(null);

  pageSizeOption: Array<number> = [10, 20, 30, 50, 100];
  productData: Array<IProductFromFirebase> = [];
  productSelected: Array<IProductFromFirebase> = [];
  categorys: Array<ICategory> = [];
  rawTypes: Array<IType> = [];
  types: Array<IGroupTypeByCategory> = [];
  typesForSelect: Array<IType> = [];
  tableHeaders: Array<ITableElement<PRODUCT_FIELD>> = [
    {
      field: 'select',
      title: '',
      fieldType: 'select',
      width: '50',
    },
    {
      field: 'name',
      title: 'Product Name',
      fieldType: 'view',
      width: '150',
    },
    {
      field: 'category',
      title: 'Category',
      width: '100',
    },
    {
      field: 'type',
      title: 'Product Type',
      width: '120',
    },
    {
      field: 'price',
      title: 'Price',
      width: '100',
    },
    {
      field: 'detail',
      title: 'Detail',
      width: '150',
    },
    {
      field: 'img',
      title: 'Product Image',
      width: '150',
    },
    {
      field: 'createdAt',
      title: 'Created At',
      fieldType: 'dateTime',
      width: '100',
    },
    {
      field: 'updatedAt',
      title: 'Last Updated At',
      fieldType: 'dateTime',
      width: '150',
    },
    {
      field: 'action',
      title: '',
      fieldType: 'action',
      width: '70',
    },
  ];
  displayedColumns: Array<PRODUCT_FIELD> = [
    'select',
    'name',
    'category',
    'type',
    'price',
    'detail',
    'img',
    'createdAt',
    'updatedAt',
    'action',
  ];
  checkAll: boolean = false;
  visibleAddProduct: boolean = false;
  addProductDialogRef!: MatDialogRef<AddProductComponent>;
  deleteProductDialogRef!: MatDialogRef<ReviewDeleteProductComponent>;
  listenChangeProductNameFilter$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private dialogService: MatDialog,
    private firebaseService: FirebaseService,
    private router: Router,
  ) {}

  //#region life circle
  ngOnInit() {
    this.parseParams();
    this.initData();

    this.listenChangeProductNameFilter$.pipe(debounceTime(300)).subscribe(resp => {
      this.onChangeFilter();
    });
  }

  ngOnDestroy(): void {}
  //#endregion

  //#region firebase
  getProducts() {
    this.loading.getProducts.set(true);
    const _payload = {
      ...this.params.getAPIParams,
    };
    this.firebaseService
      .searchDocumentWithField<IProduct>(FIRESTORE_COLLECTION.PRODUCTS, _payload)
      .subscribe((resp) => {
        const data = resp.data;
        this.productData = data.map((prod) => {
          return {
            ...prod,
            select: false,
          };
        });
        this.checkProductSelected();
        this.checkAllSelect();
        this.checkDisableDelete();
        this.params.totalElements = resp.totalElements;
        this.changeUrl(false);
        this.loading.getProducts.set(false);
      });
  }

  getProductCatrgory() {
    this.firebaseService.getCollection<ICategory>(FIRESTORE_COLLECTION.CATEGORYS, false).subscribe(resp => {
      this.categorys = resp;
      this.loading.getCategory.set(true);
    });
  }

  getProductType() {
    this.firebaseService.getCollection<IType>(FIRESTORE_COLLECTION.TYPES, false).subscribe(resp => {
      this.rawTypes = resp;
      this.types = this.cookingTypeByCategory(resp);

      if (this.params.category) {
        this.onChangeCategory(this.params.category as any);
      }
      this.loading.getType.set(true);
    });
  }

  createNewProduct(data: IProduct) {
    this.loading.addProduct.set(true);
    this.firebaseService
      .addNewDocument(FIRESTORE_COLLECTION.PRODUCTS, data)
      .subscribe((resp) => {
        if (resp) {
          this.onCloseAddProductDialog(true);
        }
        this.loading.addProduct.set(false);
      });
  }

  updateProduct(data: IProductFromFirebase) {
    this.loading.updateProduct.set(true);
    this.firebaseService
      .updateDocument(FIRESTORE_COLLECTION.PRODUCTS, data.id, data)
      .subscribe((resp) => {
        if (resp) {
          this.onCloseAddProductDialog(true);
        }
        this.loading.updateProduct.set(false);
      });
  }

  deleteProducts(products: Array<IProductFromFirebase>) {
    this.firebaseService.deleteDocument(FIRESTORE_COLLECTION.PRODUCTS, products).subscribe({
      next: resp => {
        this.productSelected = [];
        this.onCloseDeleteProductDialog(true);
      },
      error: error => {}
    });
  }
  //#endregion

  //#region local func
  initData() {
    this.getProductCatrgory();
    this.getProductType();
  }

  onChangeProductName(value: string) {
    this.listenChangeProductNameFilter$.next(value);
  }

  onChangeCategory(category: PRODUCT_CATEGORY) {
    this.typesForSelect = this.types.find(type => type.category === category)?.types ?? [];
    this.onChangeFilter();
  }

  onClearFilter(filter: 'name' | 'category' | 'type', evt: Event) {
    evt.stopPropagation();
    this.params[filter] = '';

    if (filter === 'category') {
      this.params.type = '';
    }
    this.onChangeFilter();
  }

  onChangeFilter() {
    this.params.pageNumber = 0;
    this.changeUrl();
  }

  onRefresh() {
    this.changeUrl();
  }

  onReset() {
    this.params.name = '';
    this.params.category = '';
    this.params.type = '';
    this.changeUrl();
  }

  parseParams() {
    const object = Helpers.convertParamsToObject(Helpers.getParamString());
    // parse params to model
    this.params = new ProductModel(object);
    this.changeUrl(false);
  }

  changeUrl(getData: boolean = true) {
    this.params = new ProductModel(this.params);
    const _params = this.params.getURLParams;
    this.router.navigate([], {
      queryParams: _params,
      queryParamsHandling: 'merge',
    });
    if (getData) this.getProducts();
  }

  cookingTypeByCategory(data: Array<IType>): Array<IGroupTypeByCategory> {
    const returnData: Array<IGroupTypeByCategory> = [];

    data.forEach(prod => {
      const existIndex = returnData.findIndex(retProd => retProd.category === prod.category);
      if (existIndex > -1) {
        returnData[existIndex].types.push(prod);
      } else {
        returnData.push({
          category: prod.category,
          types: [prod],
        })
      }
    });
    return returnData;
  }

  onClickSelectProduct(select: boolean, product: IProductFromFirebase) {
    if (select) {
      this.productSelected.push(product);
    } else {
      this.productSelected = this.productSelected.filter(
        (prod) => prod.id !== product.id
      );
    }
    this.checkAllSelect();
    this.checkDisableDelete();
  }

  onClickSelectAll(select: boolean) {
    this.productData = this.productData.map(prod => {
      return {
        ...prod,
        select,
      };
    });
    if (select) {
      this.productSelected = [...this.productData];
    } else {
      this.productSelected = [];
    }
    this.checkDisableDelete();
  }

  checkProductSelected() {
    this.productData = this.productData.map((prod) => {
      prod.select = !!this.productSelected.find(
        (prodSl) => prodSl.id === prod.id
      );
      return {
        ...prod,
      };
    });
  }

  checkAllSelect() {
    this.checkAll = !!this.productData.length && this.productData.every((prod) => prod.select);
  }

  checkDisableDelete() {
    const _disable = !this.productSelected.length;
    this.disable.delete.set(_disable);
  }

  onClickUpdateProduct(product: IProductFromFirebase) {
    this.onToggleVisibleAddProduct();
    this.onOpenAddProductDialog('UPDATE', product);
  }

  onClickAddProduct(product?: IProductFromFirebase, reload?: boolean) {
    this.onToggleVisibleAddProduct();
    this.onOpenAddProductDialog('CREATE', product);
  }

  onToggleVisibleAddProduct() {
    this.visibleAddProduct = !this.visibleAddProduct;
  }

  onClickDeleteProduct() {
    const selectedProducts = [...this.productSelected];
    this.onOpenDeleteProductDialog(selectedProducts);
  }

  onChangePagination(pag: PageEvent) {
    this.params.pageNumber = pag.pageIndex;
    this.params.pageSize = pag.pageSize;
    this.changeUrl();
  }
  //#endregion

  //#region dialog
  onOpenAddProductDialog(action: 'CREATE' | 'UPDATE' | 'VIEW', product?: IProductFromFirebase) {
    this.addProductDialogRef = this.dialogService.open(AddProductComponent, {
      data: {
        product: product,
        categorys: this.categorys,
        types: this.types,
        isView: action === 'VIEW',
      },
      autoFocus: false,
    });

    this.addProductDialogRef.componentInstance.formValueChange.subscribe(
      (resp) => {
        if (action === 'CREATE') {
          this.createNewProduct(resp);
        } else {
          this.updateProduct(resp);
        }
      }
    );
    this.addProductDialogRef.componentInstance.closeDialog.subscribe(
      (resp) => {
        this.onCloseAddProductDialog();
      }
    );
  }

  onCloseAddProductDialog(reload?: boolean) {
    this.addProductDialogRef?.close();
    if (reload) {
      this.getProducts();
    }
  }

  onOpenDeleteProductDialog(products: Array<IProductFromFirebase>) {
    this.deleteProductDialogRef = this.dialogService.open(ReviewDeleteProductComponent, {
      data: {
        products: products,
      },
      autoFocus: false,
    });

    this.deleteProductDialogRef.componentInstance.deleteProducts.subscribe(
      (resp) => {
        this.deleteProducts(resp);
      }
    );
    this.deleteProductDialogRef.componentInstance.closeDialog.subscribe(
      (resp) => {
        this.onCloseDeleteProductDialog();
      }
    );
  }

  onCloseDeleteProductDialog(reload?: boolean) {
    this.deleteProductDialogRef?.close();
    if (reload) {
      this.getProducts();
    }
  }
  //#endregion
}
