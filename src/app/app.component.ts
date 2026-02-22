import { Component, OnInit } from '@angular/core';
import { TestService } from './core/test.service';
import { SessionService } from './core/session.service';
import { LoginComponent } from "./features/auth/login/login.component";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="user; else loginTemplate">
      <header>
        <span>{{ user.email }}</span>
        <button (click)="logout()">Logout</button>
      </header>

      <router-outlet></router-outlet>
    </div>

    <ng-template #loginTemplate>
      <app-login></app-login>
    </ng-template>
  `,
  imports: [CommonModule, LoginComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
  user: any; 
  testService: any;
  constructor(private session: SessionService) {
    this.session.user$.subscribe(u => (this.user = u));
  }

  logout() {
    this.session.logout();
  }

  ngOnInit() {}

  async test() {
    const result = await this.testService.testConnection();
    console.log('Result:', result);
  }
}