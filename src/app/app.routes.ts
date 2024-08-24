import { Routes } from '@angular/router';
import { ROUTE } from '@enums';

export const routes: Routes = [
  {
    path: ROUTE.PRODUCTS,
    loadComponent: () => import('./pages/products/products.component').then(c => c.ProductsComponent)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ROUTE.PRODUCTS
  }
];
