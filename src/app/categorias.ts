// Archivo: src/app/categorias.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface Categoria {
  codigo: number;
  nome: string; // Usamos 'nome' como en tu base de datos
}

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categorias`; // Asumiendo que tu endpoint es /categorias

  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  guardar(categoria: { nome: string }): Observable<any> {
    return this.http.post(this.apiUrl, categoria);
  }

  eliminar(codigo: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`);
  }
  buscarPorCodigo(codigo: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${codigo}`);
  }

  actualizar(categoria: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${categoria.codigo}`, categoria);
  }
  
}
