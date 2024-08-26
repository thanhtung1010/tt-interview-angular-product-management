import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  standalone: true,
  selector: 'app-social-network',
  templateUrl: './social-network.component.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
    MatListModule,
    MatButtonModule,
  ]
})
export class SocialNetworkComponent implements OnInit {
  @Output() closeDialog = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onCloseDialog() {
    this.closeDialog.emit();
  }

}
