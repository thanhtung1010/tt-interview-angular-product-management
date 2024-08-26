import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { IProductFromFirebase, ITableElement, PRODUCT_FIELD } from '@interfaces';
import { DateTimePipe } from '@pipes';

@Component({
  standalone: true,
  selector: 'tt-review-delete-product',
  templateUrl: './review-delete-product.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DateTimePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatProgressBarModule,
  ]
})
export class ReviewDeleteProductComponent implements OnInit {
  @Output() deleteProducts: EventEmitter<Array<IProductFromFirebase>> = new EventEmitter();
  @Output() closeDialog = new EventEmitter();

  loading = {
    submit: signal(false),
  };
  tableHeaders: Array<ITableElement<PRODUCT_FIELD>> = [
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
  products: Array<IProductFromFirebase> = [];

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    this.products = this.data.products ?? [];
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.products = [...this.products];
    this.checkRemoveAllProduct();
  }

  checkRemoveAllProduct() {
    if (!this.products.length) this.onCloseDialog();
  }

  submit() {
    this.loading.submit.set(true);
    this.deleteProducts.emit(this.products);
  }

  onCloseDialog() {
    this.closeDialog.emit();
  }

}
