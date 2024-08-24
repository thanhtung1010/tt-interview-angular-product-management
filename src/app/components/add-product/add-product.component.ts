import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogContainer, MatDialogActions, MatDialogClose, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FORM_DEFAULT_VALUE } from '@enums';
import { IAddProduct, IProduct } from '@interfaces';

@Component({
  standalone: true,
  selector: 'tt-add-product',
  templateUrl: './add-product.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class AddProductComponent implements OnInit, OnChanges {
  @ViewChild('modal') modalElementRef!: ElementRef;
  @Input() product?: IProduct;

  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  productForm!: FormGroup<IAddProduct>;
  dialogRef!: MatDialogRef<AddProductComponent>;

  constructor(
    private fb: FormBuilder,
    private dialogService: MatDialog,
  ) { }

  //#region life cycle
  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      this.onToggleVisibleAddProduct(this.visible);
    }
  }
  //#endregion

  initForm() {
    this.productForm = this.fb.group({
      name: [FORM_DEFAULT_VALUE.STRING, [Validators.required]],
      category: [FORM_DEFAULT_VALUE.STRING, [Validators.required]],
      type: [FORM_DEFAULT_VALUE.STRING, [Validators.required]],
      price: [FORM_DEFAULT_VALUE.NUMBER, [Validators.required]],
      detail: [FORM_DEFAULT_VALUE.STRING, []],
      img: [FORM_DEFAULT_VALUE.STRING, []],
    });

    if (this.product) {
      this.productForm.patchValue(this.product);
    }
  }

  onToggleVisibleAddProduct(visible: boolean) {
    if (visible) {
      this.dialogRef = this.dialogService.open(AddProductComponent);
    } else {
      this.dialogRef?.close();
    }
    this.visible = visible;
    this.visibleChange.emit(this.visible);
  }

}
