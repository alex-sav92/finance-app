import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule]
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