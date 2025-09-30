// Archivo: src/app/categorias-buscar/categorias-buscar.ts (Versión Reactiva Final)

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriasService } from '../categorias';
import { Auth } from '../auth'; // Asegúrate de que el nombre del archivo sea correcto
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categorias-buscar',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './categorias-buscar.html',
  styleUrl: './categorias-buscar.css'
})
export class CategoriasBuscar implements OnInit, OnDestroy {

  private categoriasService = inject(CategoriasService);
  private authService = inject(Auth);
  private authSubscription?: Subscription; // Para gestionar la suscripción

  categorias: any[] = [];

  ngOnInit(): void {
    // --- SOLUCIÓN REACTIVA Y DEFINITIVA ---
    // Nos suscribimos al estado de autenticación de nuestro AuthService.
    this.authSubscription = this.authService.authStatus$.subscribe(isAuthenticated => {
      // Solo cargaremos las categorías si el estado es 'true' (sesión iniciada).
      if (isAuthenticated) {
        this.cargarCategorias();
      } else {
        // Opcional: limpiar la lista si el usuario cierra sesión.
        this.categorias = [];
      }
    });
  }

  ngOnDestroy(): void {
    // Buena práctica: cancelar la suscripción para evitar fugas de memoria.
    this.authSubscription?.unsubscribe();
  }

  cargarCategorias() {
    this.categoriasService.listarTodas().subscribe(datos => {
      this.categorias = datos;
    });
  }

  eliminar(codigo: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.categoriasService.eliminar(codigo).subscribe({
        next: () => {
          alert('Categoría eliminada con éxito.');
          this.cargarCategorias();
        },
        error: (err) => {
          console.error('Error al eliminar categoría:', err);
          alert('No se pudo eliminar la categoría.');
        }
      });
    }
  }
}
