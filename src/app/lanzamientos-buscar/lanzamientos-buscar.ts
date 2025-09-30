// Archivo: src/app/lanzamientos-buscar/lanzamientos-buscar.ts (Versión Reactiva Final)

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Lanzamientos } from '../lanzamientos';
import { Auth } from '../auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lanzamientos-buscar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lanzamientos-buscar.html',
  styleUrls: ['./lanzamientos-buscar.css']
})
export class LanzamientosBuscar implements OnInit, OnDestroy {

  private lanzamientosService = inject(Lanzamientos);
  private authService = inject(Auth);

  private authSubscription?: Subscription;

  lanzamientos: any[] = [];

  ngOnInit(): void {
    // --- SUSCRIPCIÓN REACTIVA AL ESTADO DE AUTENTICACIÓN ---
    this.authSubscription = this.authService.authStatus$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.cargarLanzamientos();
      } else {
        // Limpiamos la lista si el usuario cierra sesión
        this.lanzamientos = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe(); // Evitar fugas de memoria
  }

  cargarLanzamientos(): void {
    this.lanzamientosService.listar().subscribe({
      next: (datos) => {
        this.lanzamientos = datos;
      },
      error: (err) => {
        console.error('Error al cargar lanzamientos:', err);
      }
    });
  }

  eliminar(codigo: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este lanzamiento?')) {
      this.lanzamientosService.eliminar(codigo).subscribe({
        next: () => {
          alert('Lanzamiento eliminado con éxito.');
          this.cargarLanzamientos(); // Recargamos la lista
        },
        error: (err) => {
          console.error('Error al eliminar lanzamiento:', err);
          alert('No se pudo eliminar el lanzamiento.');
        }
      });
    }
  }
}
