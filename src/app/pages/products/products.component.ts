import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddProductComponent, TableLayoutComponent } from '@components';

@Component({
  standalone: true,
  selector: 'tt-products',
  templateUrl: './products.component.html',
  imports: [
    CommonModule,
    TableLayoutComponent,
    AddProductComponent,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ProductsComponent implements OnInit {
  @ViewChild('addProduct') addProductRef!: ElementRef;

  visibleAddProduct: boolean = false;

  constructor(
  ) { }

  ngOnInit() {
  }

  onToggleAddProduct() {
    this.visibleAddProduct = !this.visibleAddProduct;
  }

}
