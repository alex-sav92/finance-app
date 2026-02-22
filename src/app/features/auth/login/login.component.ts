// src/app/features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-form">
      <h2>Login</h2>
      <input type="email" placeholder="Email" [(ngModel)]="email" />
      <button (click)="submit()">Send Magic Link</button>
      <p>{{ message }}</p>
    </div>
  `,
})
export class LoginComponent {
  email: string = '';
  message: string = '';

  constructor(private auth: AuthService) {}

  async submit() {
    try {
      await this.auth.login(this.email);
      this.message = 'Check your email for the login link!';
    } catch (err: any) {
      this.message = err.message;
    }
  }
}