// src/app/app.component.ts
// src/app/features/transactions/add-transaction.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from './core/session.service';
import { LoginComponent } from './features/auth/login/login.component';
import { AddTransactionComponent } from './features/transactions/add-transaction/add-transaction.component';
import { TransactionsListComponent } from './features/transactions/transaction-list/transaction-list.component';
import { AccountsListComponent } from './features/accounts/accounts-list/accounts-list.component';
import { DashboardComponent } from "./features/dashboard/dashboard.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    AccountsListComponent,
    TransactionsListComponent,
    AddTransactionComponent,
    DashboardComponent
],
  template: `
    <div *ngIf="user; else loginTemplate">
      <header>
        <span>{{ user.email }}</span>
        <button (click)="logout()">Logout</button>
      </header>

      <app-accounts-list></app-accounts-list>
      <app-add-transaction></app-add-transaction>
      <app-dashboard></app-dashboard>
      <app-transactions-list></app-transactions-list>
    </div>

    <ng-template #loginTemplate>
      <app-login></app-login>
    </ng-template>
  `,
})
export class AppComponent {
  user: any;

  constructor(private session: SessionService) {
    this.session.user$.subscribe(u => (this.user = u));
  }

  logout() {
    this.session.logout();
  }
}