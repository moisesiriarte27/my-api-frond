// Archivo: src/app/personas-registro/personas-registro.ts

// 1. AÑADIMOS LAS IMPORTACIONES NECESARIAS
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router'; // ActivatedRoute es necesario
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PersonasService, Persona } from '../personas'; // Importamos la interfaz Persona

// Módulos de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-personas-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './personas-registro.html',
  styleUrl: './personas-registro.css'
})
export class PersonasRegistro implements OnInit {

  private personasService = inject(PersonasService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // 2. CORREGIMOS EL FORMULARIO PARA QUE COINCIDA CON EL HTML
  //    Usamos 'nombre' en el formulario y lo convertimos a 'nome' al enviar
  personaForm = new FormGroup({
    codigo: new FormControl<number | null>(null),
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]), // Mantenemos 'nombre' para el HTML
    activo: new FormControl(true),
    direccion: new FormGroup({
        calle: new FormControl(''),
        numero: new FormControl(''),
        complemento: new FormControl(''),
        barrio: new FormControl(''),
        codigoPostal: new FormControl(''),
        ciudad: new FormControl('', Validators.required),
        estado: new FormControl('', Validators.required)
    })
  });

  ngOnInit(): void {
    const codigoPersona = this.route.snapshot.params['codigo'];
    if (codigoPersona) {
      this.cargarPersona(codigoPersona);
    }
  }

  cargarPersona(codigo: number) {
    this.personasService.buscarPorCodigo(codigo).subscribe((persona: Persona) => {
      // Convertimos 'nome' de la API a 'nombre' para el formulario
      this.personaForm.setValue({
        codigo: persona.codigo,
        nombre: persona.nombre, // Convertimos nome → nombre
        activo: persona.activo,
        direccion: persona.direccion
      });
    });
  }

  // 3. RENOMBRAMOS EL MÉTODO PARA QUE COINCIDA CON EL HTML
  guardarPersona() {
    if (this.personaForm.invalid) {
      this.personaForm.markAllAsTouched();
      return;
    }

    const formData = this.personaForm.getRawValue();
    
    // Convertimos 'nombre' del formulario a 'nome' para la API
    const personaData: Persona = {
      codigo: formData.codigo!,
      nombre: formData.nombre!, // Convertimos nombre → nome
      activo: formData.activo!,
      direccion: formData.direccion!
    };

    if (personaData.codigo) {
      this.personasService.actualizar(personaData).subscribe(() => {
        alert('Persona actualizada con éxito');
        this.router.navigate(['/personas']);
      });
    } else {
      this.personasService.guardar(personaData).subscribe(() => {
        alert('Persona guardada con éxito');
        this.router.navigate(['/personas']);
      });
    }
  }

  // 4. AÑADIMOS EL MÉTODO 'nuevaPersona' QUE FALTABA
  nuevaPersona() {
    this.personaForm.reset({
      codigo: null,
      nombre: '', // Usamos 'nombre' para el formulario
      activo: true,
      direccion: {
        calle: '',
        numero: '',
        complemento: '',
        barrio: '',
        codigoPostal: '',
        ciudad: '',
        estado: ''
      }
    });
  }

  volverALaBusqueda() {
    this.router.navigate(['/personas']);
  }
}