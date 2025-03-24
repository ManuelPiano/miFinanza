import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertController } from '@ionic/angular/standalone';
import { DatabaseService } from '../database.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_state';
  private readonly USER_KEY = 'user_name';
  private isAuthenticated = new BehaviorSubject<boolean>(this.getStoredAuthState());
  private userName = new BehaviorSubject<string>(this.getStoredUserName());

  constructor(
    private router: Router,
    private alertController: AlertController,
    private databaseService: DatabaseService
  ) {
    this.checkInitialSession();
  }

  private checkInitialSession() {
    if (this.getStoredAuthState()) {
      this.isAuthenticated.next(true);
      this.userName.next(this.getStoredUserName());
    }
  }

  private getStoredAuthState(): boolean {
    const storedState = localStorage.getItem(this.AUTH_KEY);
    return storedState ? JSON.parse(storedState) : false;
  }

  private getStoredUserName(): string {
    return localStorage.getItem(this.USER_KEY) || '';
  }

  private setStoredAuthState(state: boolean) {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(state));
    this.isAuthenticated.next(state);
  }

  private setStoredUserName(name: string) {
    localStorage.setItem(this.USER_KEY, name);
    this.userName.next(name);
  }

  getUserName(): Observable<string> {
    return this.userName.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  async register(username: string, password: string, name: string): Promise<boolean> {
    try {
      const success = await this.databaseService.addUser(username, password, name);
      if (success) {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Usuario registrado correctamente',
          buttons: ['OK']
        });
        await alert.present();
        return true;
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo registrar el usuario',
          buttons: ['OK']
        });
        await alert.present();
        return false;
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    }
  }
  async login(username: string, password: string, name: string) {
    if (username === 'admin' && password === 'finanza123') {
      this.setStoredAuthState(true);
      this.setStoredUserName(name); // Guardamos el nombre de usuario
      
      const alert = await this.alertController.create({
        header: '¡Bienvenido!',
        message: 'Has iniciado sesión correctamente',
        cssClass: 'custom-alert',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/folder/home']);
          }
        }]
      });

      await alert.present();
      return true;
    } else {
      this.setStoredAuthState(false);
      this.setStoredUserName('');
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario o contraseña incorrectos',
        cssClass: 'custom-alert',
        buttons: ['Aceptar']
      });

      await alert.present();
      return false;
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar la sesión?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Sí, cerrar sesión',
          handler: async () => {
            this.setStoredAuthState(false);
            this.setStoredUserName(''); // Limpiamos el nombre de usuario
            
            const confirmAlert = await this.alertController.create({
              header: 'Sesión cerrada',
              message: 'Has cerrado sesión correctamente',
              cssClass: 'custom-alert',
              buttons: [{
                text: 'OK',
                handler: () => {
                  this.router.navigate(['/login']);
                }
              }]
            });

            await confirmAlert.present();
          }
        }
      ]
    });

    await alert.present();
    
    const { role } = await alert.onDidDismiss();
    if (role === 'cancel') {
      return;
    }
  }
}