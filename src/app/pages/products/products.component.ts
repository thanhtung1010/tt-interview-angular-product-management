import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddProductComponent, ReviewDeleteProductComponent, TableLayoutComponent } from '@components';
import { FIRESTORE_COLLECTION } from '@enums';
import {
  IPagination,
  IProduct,
  IProductFromFirebase,
  ITableElement,
  ITableLayout,
  PRODUCT_FIELD,
} from '@interfaces';
import { DateTimePipe } from '@pipes';
import { FirebaseService } from '@services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MinWidthDirective } from '@directives';

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
  ],
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild('addProduct') addProductRef!: ElementRef;

  loading = {
    getProducts: signal(false),
    addProduct: signal(false),
    updateProduct: signal(false),
  };
  disable = {
    delete: signal(true),
  };
  tableSetting: ITableLayout = { };
  pagination: IPagination = {
    pageNumber: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0
  };
  pageSizeOption: Array<number> = [10, 20, 30, 50, 100];

  productData: Array<IProductFromFirebase> = [];
  productSelected: Array<IProductFromFirebase> = [];
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

  constructor(
    private dialogService: MatDialog,
    private firebaseService: FirebaseService
  ) {}

  //#region life circle
  ngOnInit() {
    this.getProducts();
  }

  ngOnDestroy(): void {}
  //#endregion

  //#region firebase
  getProducts() {
    this.loading.getProducts.set(true);
    this.firebaseService
      .getCollection<IProduct>(FIRESTORE_COLLECTION.PRODUCTS)
      .subscribe((resp) => {
        this.productData = resp.map((prod) => {
          return {
            ...prod,
            select: false,
          };
        });
        this.checkProductSelected();
        this.checkAllSelect();
        this.checkDisableDelete();
        this.pagination.totalElements = this.productData.length;
        this.loading.getProducts.set(false);
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

  onChangePagination(data: any) {
    console.log(data);
  }
  //#endregion

  //#region dialog
  onOpenAddProductDialog(action: 'CREATE' | 'UPDATE' | 'VIEW', product?: IProductFromFirebase) {
    this.addProductDialogRef = this.dialogService.open(AddProductComponent, {
      data: {
        product: product,
      },
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
