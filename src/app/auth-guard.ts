import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth'; // <-- IMPORTACIÓN ESTANDARIZADA

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  console.warn('AuthGuard: usuario no autenticado, redirigiendo a /login');
  return router.parseUrl('/login');
};
