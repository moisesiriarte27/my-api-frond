// Archivo: src/app/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos nuestro AuthService para acceder al token
  const authService = inject(Auth);
  const token = authService.getToken();

  // Si el token existe, clonamos la petición para añadirle la cabecera
  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    // Pasamos la petición clonada (con el token) al siguiente manejador
    return next(clonedRequest);
  }

  // Si no hay token, simplemente dejamos pasar la petición original
  return next(req);
};
