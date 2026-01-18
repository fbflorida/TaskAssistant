import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
    canActivate: [authGuard],
  },
  {
    path: 'tasklist/:id',
    loadComponent: () => import('./taskdetail/taskdetail.component'),
    canActivate: [authGuard],
  },
  {
    path: 'register',
    loadComponent: () => import ('./register/register.component'),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];