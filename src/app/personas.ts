import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

// Definimos la estructura de Persona que coincida exactamente con el backend Java
export interface Persona {
  codigo: number; // En Java es Long, en TypeScript es number
  nombre: string; // En Java es String nombre (no nome)
  activo: boolean; // En Java es Boolean activo
  direccion: {
    calle: string | null;
    numero: string | null;
    complemento: string | null;
    barrio: string | null;
    codigoPostal: string | null;
    ciudad: string | null;
    estado: string | null;
  };
}

@Injectable({ providedIn: 'root' })
export class PersonasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/personas`;
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  listarTodas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl);
  }

  buscarPorCodigo(codigo: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/${codigo}`);
  }

  guardar(persona: any): Observable<Persona> {
    // Asegurémonos de que la URL sea correcta
    console.log('Enviando datos:', persona); // Para debugging
    console.log('URL:', this.apiUrl); // Para debugging
    return this.http.post<Persona>(this.apiUrl, persona, this.httpOptions);
  }

  actualizar(persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/${persona.codigo}`, persona, this.httpOptions);
  }

  eliminar(codigo: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`);
  }
}