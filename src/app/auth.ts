// Archivo: src/app/auth.service.ts (Versión Infalible)

import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;
  private isBrowser: boolean;

  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authStatus$ = this.authStatus.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /** Decodificador robusto de JWT (maneja Base64 URL Safe) */
  private jwtDecode<T>(token: string): T | null {
    if (!this.isBrowser) return null;
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      // Base64 URL → Base64 estándar
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(decodedPayload) as T;
    } catch (error) {
      console.error("Error decodificando el token:", error);
      return null;
    }
  }

  login(credentials: { correo: string, clave: string }) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials, { headers })
      .pipe(
        tap(response => {
          if (this.isBrowser && response && response.token) {
            localStorage.setItem('authToken', response.token);
            this.authStatus.next(true);
            console.info('Login exitoso, token almacenado.');
          } else {
            console.warn('Login: no se recibió un token válido.');
          }
        })
      );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
      this.authStatus.next(false);
    }
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /** Validación robusta de autenticación */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      console.warn('isAuthenticated: no hay token en localStorage.');
      return false;
    }

    const decodedToken = this.jwtDecode<{ exp?: number }>(token);
    if (!decodedToken) {
      console.warn('isAuthenticated: token inválido o corrupto.');
      return false;
    }

    // Si el token tiene "exp", se valida la fecha
    if (decodedToken.exp) {
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      const isExpired = expirationDate.valueOf() <= new Date().valueOf();
      if (isExpired) {
        console.warn('isAuthenticated: token expirado.');
        return false;
      }
    }

    // Si no tiene "exp", se considera válido mientras exista
    return true;
  }
}
