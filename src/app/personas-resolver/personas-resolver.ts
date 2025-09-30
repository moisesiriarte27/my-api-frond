import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoriasService } from '../categorias'; // Asegúrate que el servicio se llame así
import { Observable } from 'rxjs';

export const categoriasResolver: ResolveFn<any[]> = (route, state): Observable<any[]> => {
  const categoriasService = inject(CategoriasService);
  return categoriasService.listarTodas(); // Asegúrate que el método se llame así
};
