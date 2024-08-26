import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuService } from '@services';
import { SocialNetworkComponent } from '../social-network/social-network.component';

@Component({
  standalone: true,
  selector: 'tt-header',
  templateUrl: './header.component.html',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class HeaderComponent implements OnInit {
  dialogRef!: MatDialogRef<SocialNetworkComponent>;

  constructor(
    private menuService: MenuService,
    private dialogService: MatDialog,
  ) { }

  ngOnInit() {
    this.onOpenAddProductDialog()
  }

  onOpenAddProductDialog() {
    this.dialogRef = this.dialogService.open(SocialNetworkComponent, {
      autoFocus: false,
    });
    this.dialogRef.componentInstance.closeDialog.subscribe(
      (resp) => {
        this.onCloseAddProductDialog();
      }
    );
  }

  onCloseAddProductDialog() {
    this.dialogRef?.close();
  }

  onClickMenuBtn() {
    this.menuService.onTogglVisileMenu();
  }

}
