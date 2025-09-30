import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Lanzamientos } from '../lanzamientos';
import { Observable } from 'rxjs';

// Este resolver se encargará de precargar los datos de los lanzamientos
export const lanzamientosResolver: ResolveFn<any[]> = (route, state): Observable<any[]> => {
  const lanzamientosService = inject(Lanzamientos);
  return lanzamientosService.listar();
};
