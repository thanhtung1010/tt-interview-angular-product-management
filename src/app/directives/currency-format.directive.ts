import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[tt-currency-format]'
})
export class CurrencyFormatDirective {
  @Input() currencyFormat: string = '$0.00'; // Default format

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.formatCurrency();
  }

  @HostListener('input', ['$event'])
  onInputChange() {
    this.formatCurrency();
  }

  private formatCurrency() {
    const elm: HTMLInputElement = this.el.nativeElement;
    let inputValue = elm.value;
    let numberValue = this.formatString(inputValue);
    let returnValue = '';
    if (!!inputValue.length) {
      const originalLen = inputValue.length;
      let caretPos = elm.selectionStart;

      // check for decimal
      // if (inputValue.indexOf(".") >= 0) {
      //   const decimalPos = inputValue.indexOf(".");
      //   let leftSide = inputValue.substring(0, decimalPos);
      //   let rightSide = inputValue.substring(decimalPos);

      //   leftSide = this.formatNumber(leftSide);
      //   rightSide = this.formatNumber(rightSide);
      //   rightSide = rightSide.substring(0, 2);
      //   inputValue = leftSide + "." + rightSide;
      // } else {
      //   inputValue = this.formatNumber(inputValue);
      // }
      returnValue = this.formatNumber(numberValue);

      // send updated string to input
      elm.value = returnValue;

      // put caret back in the right position
      const updatedLen = returnValue.length;
      if (updatedLen !== originalLen) caretPos = updatedLen - originalLen + (caretPos || 0);
      elm.setSelectionRange(caretPos, caretPos);
    }
  }

  formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  formatString(value: string): number {
    return +(value.replace(/[^\d]/g, ''));
  }
}
