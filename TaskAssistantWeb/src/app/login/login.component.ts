import { Component, inject, effect } from '@angular/core';
import { AuthService } from '../shared/data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-container">
      <form [formGroup]="loginForm" (ngSubmit)="handleSubmit()">
        <h2>Welcome!</h2>
        <div class="input-group">
            <input type="text" formControlName="email" placeholder="email" />
        </div>
        <div class="input-group">
        <input type="password" formControlName="password" placeholder="password" />
        </div>
        <button class="btn-primary" type="submit">Login</button>

        @if (authService.status() === 'fail') {
            <p>Login failed! Try again</p>
        }
        <h4>New User? Please register <a routerLink="/register">here</a></h4>
        
      </form>

      
    </div>
  `,
  imports: [ReactiveFormsModule, RouterLink]
})

export default class LoginComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.nonNullable.group({
    email: new FormControl(''),
    password: new FormControl('')
  });

  handleSubmit() {
    this.authService.login$.next(this.loginForm.getRawValue());
  }
}