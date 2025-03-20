import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) { }

  login(username: string, password: string) {
    if (username === 'admin' && password === 'finanza123') {
      this.isAuthenticated.next(true);
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Has iniciado sesión correctamente',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        // Después de mostrar el mensaje de éxito, redirige a folder/home
        this.router.navigate(['/folder/home']);
      });
      return true;
    } else {
      this.isAuthenticated.next(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Usuario o contraseña incorrectos',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }
  }

  isLoggedIn() {
    return this.isAuthenticated.asObservable();
  }

  logout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas cerrar la sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isAuthenticated.next(false);
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigate(['/login']);
      }
    });
  }
}