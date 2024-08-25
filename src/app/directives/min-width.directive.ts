import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[tt-min-width]'
})
export class MinWidthDirective {
  @Input({
    required: true,
    alias: 'tt-min-width'
  }) minWidth?: string | number | null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style = `min-width: ${this.minWidth === null ? 'unset' : (this.minWidth + 'px')};`;
  }
}
