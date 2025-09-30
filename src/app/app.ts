import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LanzamientosBuscar } from "./lanzamientos-buscar/lanzamientos-buscar";
import { Navbar } from './navbar/navbar';
import {PersonasBuscar} from './personas-buscar/personas-buscar'
import { LanzamientoRegistro } from "./lanzamientos-registro/lanzamientos-registro";


@Component({
  selector: 'app-root',
  standalone: true,   // 👈 CLAVE para standalone
  imports: [
    RouterOutlet,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    LanzamientosBuscar,
    Navbar,
    PersonasBuscar,
    RouterOutlet,
    Navbar,
    LanzamientoRegistro
],
  templateUrl: './app.html',

  encapsulation: ViewEncapsulation.None
})
export class App {
  protected readonly title = signal('project-goat');

}

