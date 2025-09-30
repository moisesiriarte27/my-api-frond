// Archivo: src/app/lanzamiento-registro/lanzamiento-registro.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// --- MODIFICACIÓN #1: Importamos las herramientas de RxJS necesarias ---
import { Observable, forkJoin } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';

// --- SERVICIOS PARA CONECTAR A LA API ---
import { Lanzamientos } from '../lanzamientos';
import { PersonasService } from '../personas';
import { CategoriasService, Categoria } from '../categorias';

// Módulos de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-lanzamiento-registro',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule,
    MatButtonToggleModule, MatAutocompleteModule
  ],
  templateUrl: './lanzamientos-registro.html',
  styleUrl: './lanzamientos-registro.css'
})
export class LanzamientoRegistro implements OnInit {

  private lanzamientosService = inject(Lanzamientos);
  private personasService = inject(PersonasService);
  private categoriasService = inject(CategoriasService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tiposDeLanzamiento = [
    { label: 'Ingreso', value: 'RECETA' },
    { label: 'Gasto', value: 'GASTO' }
  ];

  categorias: any[] = [];
  personas: any[] = [];
  personasFiltradas!: Observable<any[]>;

  lanzamientoForm = new FormGroup({
    codigo: new FormControl<number | null>(null),
    tipo: new FormControl('RECETA', Validators.required),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(5)]),
    vencimiento: new FormControl<Date | null>(null, Validators.required),
    fechaPago: new FormControl<Date | null>(null),
    valor: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    categoria: new FormControl<any | null>(null, Validators.required),
    persona: new FormControl<any | null>(null, Validators.required),
    observacion: new FormControl('')
  });

  // --- MODIFICACIÓN #2: Lógica de ngOnInit reestructurada ---
  ngOnInit(): void {
    const codigoLanzamiento = this.route.snapshot.params['codigo'];

    if (codigoLanzamiento) {
      // --- MODO EDICIÓN: Sincronizamos las llamadas ---
      // 1. Esperamos a que se carguen las categorías Y las personas
      forkJoin({
        categorias: this.categoriasService.listarTodas(),
        personas: this.personasService.listarTodas()
      }).pipe(
        // 2. Una vez cargadas, las guardamos y configuramos el filtro
        tap(resultado => {
          this.categorias = resultado.categorias.map(c => ({ label: c.nome, value: c.codigo }));
          this.personas = resultado.personas.map(p => ({ label: p.nombre, value: p.codigo }));
          this.setupFiltroPersonas();
        }),
        // 3. AHORA, y solo ahora, buscamos el lanzamiento específico
        switchMap(() => this.lanzamientosService.buscarPorCodigo(codigoLanzamiento))
      ).subscribe(lanzamiento => {
        // 4. Con todos los datos listos, rellenamos el formulario
        this.poblarFormulario(lanzamiento);
      });
    } else {
      // --- MODO CREACIÓN: No hay problema de sincronización, cargamos como antes ---
      this.cargarCategorias();
      this.cargarPersonas();
    }
  }

  // --- MODIFICACIÓN #3: Extraemos la lógica de rellenar el formulario a su propio método ---
  poblarFormulario(lanzamiento: any) {
    this.lanzamientoForm.patchValue({
      ...lanzamiento, // Rellena campos simples como 'codigo', 'descripcion', 'valor', 'tipo', etc.
      // Busca los OBJETOS completos en las listas ya cargadas
      categoria: this.categorias.find(c => c.value === lanzamiento.codigo_categoria),
      persona: this.personas.find(p => p.value === lanzamiento.codigo_personas),
      // Convierte las fechas de string a objeto Date para los datepickers
      vencimiento: new Date(lanzamiento.fechavencimiento),
      fechaPago: lanzamiento.fechapago ? new Date(lanzamiento.fechapago) : null
    });
  }

  cargarCategorias() {
    this.categoriasService.listarTodas().subscribe((datos: Categoria[]) => {
      this.categorias = datos.map(c => ({ label: c.nome, value: c.codigo }));
    });
  }

  cargarPersonas() {
    this.personasService.listarTodas().subscribe(datos => {
      this.personas = datos.map(p => ({ label: p.nombre, value: p.codigo }));
      this.setupFiltroPersonas();
    });
  }

  setupFiltroPersonas() {
    this.personasFiltradas = this.lanzamientoForm.get('persona')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.label;
        return name ? this._filter(name as string) : this.personas.slice();
      }),
    );
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.personas.filter(option => option.label.toLowerCase().includes(filterValue));
  }

  displayPersona(persona: any): string {
    return persona && persona.label ? persona.label : '';
  }

  private formatearFecha(fecha: Date | null | undefined): string | null {
    if (!fecha) return null;
    const offset = fecha.getTimezoneOffset();
    const fechaCorregida = new Date(fecha.getTime() - (offset * 60 * 1000));
    return fechaCorregida.toISOString().split('T')[0];
  }

  guardar() {
    if (this.lanzamientoForm.invalid) {
      this.lanzamientoForm.markAllAsTouched();
      return;
    }

    const formData = this.lanzamientoForm.value;

    const lanzamientoParaEnviar = {
      codigo: formData.codigo,
      descripcion: formData.descripcion,
      fechavencimiento: this.formatearFecha(formData.vencimiento),
      fechapago: this.formatearFecha(formData.fechaPago),
      valor: formData.valor,
      observacion: formData.observacion || '',
      tipo: formData.tipo,
      codigo_categoria: formData.categoria.value,
      codigo_personas: formData.persona.value
    };

    const operacion = formData.codigo
      ? this.lanzamientosService.actualizar(lanzamientoParaEnviar)
      : this.lanzamientosService.guardar(lanzamientoParaEnviar);

    operacion.subscribe({
      next: () => {
        const accion = formData.codigo ? 'actualizado' : 'guardado';
        alert(`Lanzamiento ${accion} con éxito!`);
        this.router.navigate(['/lanzamientos']);
      },
      error: (err) => {
        console.error(`Error al ${formData.codigo ? 'actualizar' : 'guardar'}:`, err);
        alert('Error al procesar la solicitud: ' + (err.error?.message || err.message));
      }
    });
  }

  nueva() {
    this.lanzamientoForm.reset({
      tipo: 'RECETA'
    });
  }

  volver() {
    this.router.navigate(['/lanzamientos']);
  }
}
