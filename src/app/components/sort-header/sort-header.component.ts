import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITableElement, PRODUCT_FIELD } from '@interfaces';

@Component({
  selector: 'tt-sort-header',
  templateUrl: './sort-header.component.html',
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class SortHeaderComponent implements OnInit {
  @Input({required: true}) header!: ITableElement<PRODUCT_FIELD>;
  @Output() headerChange: EventEmitter<ITableElement<PRODUCT_FIELD>> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClickHeader() {
    if (!this.header.showSort) {
      return;
    }

    switch (this.header.sortOrder) {
      case null:
        this.header.sortOrder = 'asc';
        break;

      case 'asc':
        this.header.sortOrder = 'desc';
        break;

      case 'desc':
        this.header.sortOrder = null;
        break;

      default:
        break;
    }
    this.emitHeader();
  }

  emitHeader() {
    this.headerChange.emit(this.header);
  }

}
