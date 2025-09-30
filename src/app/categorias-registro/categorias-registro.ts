// Archivo: src/app/categorias-registro/categorias-registro.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. AÑADE 'ActivatedRoute' A LA IMPORTACIÓN DE ROUTER
import { Router, ActivatedRoute } from '@angular/router'; 
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriasService , Categoria} from '../categorias';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
 // Importamos la interfaz

@Component({
  selector: 'app-categorias-registro',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
  templateUrl: './categorias-registro.html',
  styleUrl: './categorias-registro.css'
})
export class CategoriasRegistro implements OnInit {

  private categoriasService = inject(CategoriasService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isSaving = false;
  categoriaForm = new FormGroup({
    codigo: new FormControl<number | null>(null),
    nome: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  ngOnInit(): void {
    const codigoCategoria = this.route.snapshot.params['codigo'];
    if (codigoCategoria) {
      this.cargarCategoria(codigoCategoria);
    }
  }

  cargarCategoria(codigo: number) {
    this.categoriasService.buscarPorCodigo(codigo).subscribe(categoria => {
      this.categoriaForm.setValue(categoria); // Usamos setValue para rellenar el form
    });
  }

  // --- FUNCIÓN GUARDAR CORREGIDA ---
  guardar() {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }
    
    // Si el formulario tiene un 'codigo', significa que estamos actualizando
    if (this.categoriaForm.value.codigo) {
      // Creamos un objeto que coincide con la firma de 'actualizar()'
      const categoriaParaActualizar: Categoria = {
        codigo: this.categoriaForm.value.codigo,
        nome: this.categoriaForm.value.nome!
      };
      this.categoriasService.actualizar(categoriaParaActualizar).subscribe(() => {
        alert('Categoría actualizada con éxito');
        this.router.navigate(['/categorias']);
      });
    } else {
      // Si no hay 'codigo', estamos creando una nueva
      // Creamos un objeto que coincide con la firma de 'guardar()'
      const categoriaParaGuardar = { nome: this.categoriaForm.value.nome! };
      this.categoriasService.guardar(categoriaParaGuardar).subscribe(() => {
        alert('Categoría guardada con éxito');
        this.router.navigate(['/categorias']);
      });
    }
  }

  volver() { this.router.navigate(['/categorias']); }
}