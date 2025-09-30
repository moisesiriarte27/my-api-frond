import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- 1. IMPORTA RouterModule
import { CommonModule } from '@angular/common';
import { Auth } from '../auth';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  authService = inject(Auth);

  logout() {
    this.authService.logout();
  }
}
