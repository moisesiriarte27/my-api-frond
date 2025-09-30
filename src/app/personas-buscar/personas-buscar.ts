import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PersonasService, Persona } from "../personas";

@Component({
  selector: 'app-personas-buscar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './personas-buscar.html',
  styleUrl: './personas-buscar.css'
})
export class PersonasBuscar implements OnInit {
  
  private personasService = inject(PersonasService);
  private cd = inject(ChangeDetectorRef);
  personas: Persona[] = [];

  ngOnInit(): void {
    this.cargarPersonas();
  }

  cargarPersonas() {
    this.personasService.listarTodas().subscribe((datos: Persona[]) => {
      this.personas = datos;
      this.cd.detectChanges(); // Forzamos la actualización de la vista
    });
  }

  eliminar(codigo: number) {
    if (confirm('¿Estás seguro de que quieres eliminar a esta persona?')) {
      this.personasService.eliminar(codigo).subscribe(() => {
        alert('Persona eliminada con éxito.');
        this.cargarPersonas(); // Recargamos la lista
      });
    }
  }
}