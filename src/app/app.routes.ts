// Archivo: src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LanzamientosBuscar } from "./lanzamientos-buscar/lanzamientos-buscar";
import { PersonasBuscar } from './personas-buscar/personas-buscar';
import { LanzamientoRegistro } from './lanzamientos-registro/lanzamientos-registro';
import { PersonasRegistro } from './personas-registro/personas-registro';
import { Login } from './login/login';
import { authGuard } from './auth-guard'; // <-- IMPORTACIÓN ESTANDARIZADA
import { CategoriasBuscar } from './categorias-buscar/categorias-buscar';
import { CategoriasRegistro } from './categorias-registro/categorias-registro';
import { DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'lanzamientos', component: LanzamientosBuscar, canActivate: [authGuard] },
  { path: 'lanzamientos/nuevo', component: LanzamientoRegistro, canActivate: [authGuard] },
  { path: 'lanzamientos/:codigo', component: LanzamientoRegistro, canActivate: [authGuard] },
  { path: 'personas', component: PersonasBuscar, canActivate: [authGuard] },
  { path: 'personas/nuevo', component: PersonasRegistro, canActivate: [authGuard] },
  { path: 'personas/:codigo', component: PersonasRegistro, canActivate: [authGuard] },
  { path: 'categorias', component: CategoriasBuscar, canActivate: [authGuard] },
  { path: 'categorias/nuevo', component: CategoriasRegistro, canActivate: [authGuard] },
  { path: 'categorias/:codigo', component: CategoriasRegistro, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
