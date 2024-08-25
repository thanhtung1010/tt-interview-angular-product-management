import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from "../header/header.component";
import { MenuService } from '@services';

@Component({
  standalone: true,
  selector: 'tt-page-layout',
  templateUrl: './page-layout.component.html',
  imports: [
    MatSidenavModule,
    HeaderComponent
  ],
})
export class PageLayoutComponent implements OnInit {
  visileMenu: WritableSignal<boolean> = signal(false);

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.visileMenu.set(this.menuService.visible);
    this.menuService.visible$.subscribe(resp => {
      this.visileMenu.set(resp);
    });
  }

}
