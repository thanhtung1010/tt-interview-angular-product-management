import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ITableLayout } from '@interfaces';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  standalone: true,
  selector: 'tt-table-layout',
  templateUrl: './table-layout.component.html',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class TableLayoutComponent implements OnInit {
  @Input() tableSetting?: ITableLayout;
  @Input() loading: WritableSignal<boolean> = signal(false);

  tbStyleLoading = computed(() => this.loading() ? 'hidden' : 'auto');
  constructor() { }

  ngOnInit() {
  }

}
