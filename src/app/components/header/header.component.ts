import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuService } from '@services';

@Component({
  standalone: true,
  selector: 'tt-header',
  templateUrl: './header.component.html',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class HeaderComponent implements OnInit {

  constructor(private menuService: MenuService) { }

  ngOnInit() {
  }

  onClickMenuBtn() {
    this.menuService.onTogglVisileMenu();
  }

}
