import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, homeSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, cashSharp, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, logOutOutline, logOutSharp } from 'ionicons/icons';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonImg, RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet, CommonModule],
})
export class AppComponent { 
  public appPages = [
    { title: 'Resumen', url: '/folder/resumen', icon: 'home' },
    { title: 'Gastos', url: '/folder/gastos', icon: 'paper-plane' },
    { title: 'Ingresos', url: '/folder/ingresos', icon: 'heart' },
    { title: 'Ahorro', url: '/folder/ahorro', icon: 'archive' },
    { title: 'Transferencias', url: '/folder/transferencias', icon: 'cash' },
  ];
  userName$ = this.authService.getUserName();

  constructor(private authService: AuthService, private router: Router) {
    addIcons({ homeOutline, homeSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, cashSharp, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, logOutOutline, logOutSharp });
  }
  logout() {
    this.authService.logout(); // Removemos la navegación de aquí
  }
}
