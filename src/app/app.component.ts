import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLayoutComponent } from '@components';

@Component({
  selector: 'tt-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PageLayoutComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {

}
