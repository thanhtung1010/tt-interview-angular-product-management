import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyFormatDirective } from '@directives';
import { FORM_DEFAULT_VALUE, PRODUCT_CATEGORY } from '@enums';
import { IAddProduct, ICategory, IGroupTypeByCategory, IType } from '@interfaces';

@Component({
  standalone: true,
  selector: 'tt-add-product',
  templateUrl: './add-product.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyFormatDirective,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
  ]
})
export class AddProductComponent implements OnInit {
  @ViewChild('modal') modalElementRef!: ElementRef;
  @Output() formValueChange = new EventEmitter();
  @Output() closeDialog = new EventEmitter();

  loading = {
    initForm: signal(false),
    submit: signal(false),
  };
  isReadyFormData = computed(() => {
    const isReady = this.loading.initForm();
    return isReady;
  });
  productForm!: FormGroup<IAddProduct>;
  categorys: Array<ICategory> = [];
  types: Array<IGroupTypeByCategory> = [];
  typesForSelect: Array<IType> = [];
  isView: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.isView = this.data?.isView ?? false;
    this.initData();
    this.initForm();
  }

  initData() {
    if (this.data?.categorys) {
      this.categorys = this.data.categorys;
    }
    if (this.data?.types) {
      this.types = this.data.types;
    }

    if (this.data?.product) {
      const category = this.data.product['category'];
      this.onChangeCategory(category);
    }
  }

  onChangeCategory(category: PRODUCT_CATEGORY) {
    this.typesForSelect = this.types.find(type => type.category === category)?.types ?? [];
  }

  initForm() {
    this.productForm = this.fb.group({
      name: [FORM_DEFAULT_VALUE.STRING, [Validators.required]],
      category: [FORM_DEFAULT_VALUE.STRING, [Validators.required]],
      type: [FORM_DEFAULT_VALUE.STRING, [Validators.required]],
      price: [FORM_DEFAULT_VALUE.NUMBER, [Validators.required]],
      detail: [FORM_DEFAULT_VALUE.STRING, []],
      img: [FORM_DEFAULT_VALUE.STRING, []],
    });

    if (this.data?.product) {
      this.productForm.patchValue(this.data.product);
    }
    this.loading.initForm.set(true);
  }

  submit() {
    this.loading.submit.set(true);
    const valid = this.productForm.valid;
    if (!valid) {
      const controls: Record<string, any> = this.productForm.controls;

      for (const field in controls) {
        controls[field]?.markAsDirty();
        controls[field]?.updateValueAndValidity();
      }
      this.loading.submit.set(false);
    } else {
      let value: Record<string, any> = this.productForm.value;
      if (this.data?.product) {
        value = {
          ...this.data.product,
          ...value,
          price: this.formatCurrency(value['price'])
        };
      }
      this.formValueChange.emit(value);
    }
  }

  onCloseDialog() {
    this.closeDialog.emit();
  }

  private formatCurrency(value: string): string {
    let inputValue = value;
    let numberValue = this.formatString(inputValue);

    return this.formatNumber(numberValue);;
  }

  private formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  private formatString(value: string): number {
    return +(value.replace(/[^\d]/g, ''));
  }

}
