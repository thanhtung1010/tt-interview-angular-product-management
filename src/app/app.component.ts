import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLayoutComponent } from '@components';
import { FirebaseService } from '@services';

@Component({
  selector: 'tt-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PageLayoutComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.init();
  }

}
