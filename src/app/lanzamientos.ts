import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Lanzamientos {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/lanzamientos`;

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  guardar(lanzamiento: any): Observable<any> {
    return this.http.post(this.apiUrl, lanzamiento);
  }

  actualizar(lanzamiento: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${lanzamiento.codigo}`, lanzamiento);
  }

  buscarPorCodigo(codigo: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${codigo}`);
  }

  // --- AÑADIDO: Método necesario para que funcione el botón de eliminar ---
  eliminar(codigo: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`);
  }
}
