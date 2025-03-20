import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonItem, 
  IonInput, 
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonList,
  IonImg, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonText, 
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon,
    IonList,
    IonImg
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { username, password, name } = this.loginForm.value;
      await this.authService.login(username, password, name);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}