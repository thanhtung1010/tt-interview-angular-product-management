import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
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
import { FIRESTORE_COLLECTION, FORM_DEFAULT_VALUE, PRODUCT_CATEGORY } from '@enums';
import { IAddProduct, IProduct, ICategory, IProductFromFirebase, IType, IGroupTypeByCategory } from '@interfaces';
import { FirebaseService } from '@services';

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
    getCategory: signal(false),
    getType: signal(false),
  };
  isReadyFormData = computed(() => {
    return this.loading.initForm() && this.loading.getCategory() && this.loading.getType();
  });
  productForm!: FormGroup<IAddProduct>;
  categorys: Array<ICategory> = [];
  types: Array<IGroupTypeByCategory> = [];
  typesForSelect: Array<IType> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.initData();
  }

  initData() {
    this.getProductCatrgory();
    this.getProductType();
  }

  getProductCatrgory() {
    this.firebaseService.getCollection<ICategory>(FIRESTORE_COLLECTION.CATEGORYS, false).subscribe(resp => {
      this.categorys = resp;
      this.loading.getCategory.set(true);
    });
  }

  getProductType() {
    this.firebaseService.getCollection<IType>(FIRESTORE_COLLECTION.TYPES, false).subscribe(resp => {
      this.types = this.cookingTypeByCategory(resp);
      this.loading.getType.set(true);
    });
  }

  onChangeCategory(category: PRODUCT_CATEGORY) {
    this.typesForSelect = this.types.find(type => type.category === category)?.types ?? [];
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
    const valid = this.productForm.valid;
    if (!valid) {
      const controls: Record<string, any> = this.productForm.controls;

      for (const field in controls) {
        controls[field]?.markAsDirty();
        controls[field]?.updateValueAndValidity();
      }
    } else {
      let value: Record<string, any> = this.productForm.value;
      if (this.data?.product) {
        value = {
          ...this.data.product,
          ...value,
        };
      }
      this.formValueChange.emit(value);
    }
  }

  onCloseDialog() {
    this.closeDialog.emit();
  }

}
