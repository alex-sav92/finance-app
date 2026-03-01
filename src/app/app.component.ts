// src/app/app.component.ts
// src/app/features/transactions/add-transaction.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from './core/session.service';
import { LoginComponent } from './features/auth/login/login.component';
import { HeaderComponent } from "./header/header.component";
import { AuthService } from './core/auth.service';
import { RouterOutlet } from '@angular/router';
import { PreferencesService } from './services/preferences.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    HeaderComponent,
    RouterOutlet
],
  template: `
    <div *ngIf="user; else loginTemplate">
      <app-header *ngIf="user"></app-header>
      
      <router-outlet></router-outlet>
    </div>

    <ng-template #loginTemplate>
      <app-login></app-login>
    </ng-template>
  `,
})
export class AppComponent {
  user: any;

  constructor(private session: SessionService, private auth: AuthService, private preferencesService: PreferencesService) {
    this.session.user$.subscribe(u => (this.user = u));
  }

  async ngOnInit() {
    this.user = await this.auth.getUser();
    this.loadPreferences();
  }

  async loadPreferences() {
    const { data } = await this.preferencesService.getPreferences();
    if (data?.dark_mode) {
      document.body.classList.add('dark-mode');
    }
  }

  logout() {
    this.session.logout();
  }
}