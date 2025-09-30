// Archivo: src/app/login/login.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../auth';

// Módulos de Angular Material para el formulario
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  // Inyectamos los servicios que necesitamos
  private authService = inject(Auth);
  private router = inject(Router);

  // Una variable para mostrar un mensaje de error si el login falla
  errorEnLogin = false;

  // Creamos el formulario reactivo
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  login() {
    if (this.loginForm.invalid) {
      return; // Si el formulario no es válido, no hacemos nada
    }

    // Extraemos las credenciales del formulario
    const credentials = {
      correo: this.loginForm.value.email!,
      clave: this.loginForm.value.password!
    };

    // Llamamos al método login de nuestro AuthService
    this.authService.login(credentials).subscribe({
      next: () => {
        // --- ÚNICA MODIFICACIÓN ---
        // Si el login es exitoso, navegamos al nuevo dashboard.
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Si la API devuelve un error (ej: 401 Unauthorized), mostramos un mensaje
        console.error('Error de login', err);
        this.errorEnLogin = true;
      }
    });
  }
}
