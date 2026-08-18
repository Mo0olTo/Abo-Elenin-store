import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./admin/login/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./admin/products/pages/products/products').then((m) => m.Products),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./admin/categories/pages/categories/categories').then((m) => m.Categories),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/store/home',
  },
  {
    path: 'store',
    loadComponent: () => import('./layouts/store-layout/store-layout').then((m) => m.StoreLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadComponent: () => import('./store/home/home').then((m) => m.Home),
      },
      {
        path: 'categories',
        loadComponent: () => import('./store/categories/categories').then((m) => m.Categories),
      },
      {
        path: 'new-arrivals',
        loadComponent: () => import('./store/new-arrivals/new-arrivals').then((m) => m.NewArrivals),
      },
      {
        path: 'products',
        loadComponent: () => import('./store/products/products').then((m) => m.Products),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./store/product-details/product-details').then((m) => m.ProductDetails),
      },
      {
        path: 'cart',
        loadComponent: () => import('./store/cart/cart').then((m) => m.Cart),
      },
      {
        path: 'checkout',
        loadComponent: () => import('./store/checkout/checkout').then((m) => m.Checkout),
      },
    ],
  },
  { path: '**', redirectTo: '/store/home' },
];
