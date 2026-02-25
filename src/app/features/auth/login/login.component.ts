import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-card">

      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        [(ngModel)]="email">

      <input
        type="password"
        placeholder="Password"
        [(ngModel)]="password">

      <button (click)="login()" [disabled]="loading">

        {{ loading ? 'Signing in...' : 'Login' }}

      </button>

      <p class="error" *ngIf="error">
        {{ error }}
      </p>
  </div>
  `,
})
export class LoginComponent {
  message: string = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService) {}

  async login() {

    this.error = '';
    this.loading = true;

    try {

      await this.auth.login(this.email, this.password);

      location.reload();

    } catch (err: any) {

      this.error = err.message;
    }

    this.loading = false;
  }
  async register() {
    await this.auth.register(this.email, this.password);
    alert('Check your email to confirm account');
  }
}