import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./login.component.css'],
  template: `
  <div class="card">

    <h2>Login</h2>
    <div class="form-grid">
    <form (ngSubmit)="login()" class="form">
      <div class="form-group">
        <label>Email</label>
        <input
          type="email"
          [(ngModel)]="email"
          name="email"
          required
        />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          type="password"
          [(ngModel)]="password"
          name="password"
          required
        />
      </div>

      <button type="submit" class="primary-btn">
        Login
      </button>
      <p class="error" *ngIf="error">
        {{ error }}
      </p>
      
    </form>
  </div>
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