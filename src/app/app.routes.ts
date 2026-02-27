import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AccountsListComponent } from './features/accounts/accounts-list/accounts-list.component';
import { TransactionListComponent } from './features/transactions/transaction-list/transaction-list.component';
import { AddTransactionComponent } from './features/transactions/add-transaction/add-transaction.component';

export const routes: Routes = [
  { path: '', component: AddTransactionComponent },
  { path: 'transactions', component: TransactionListComponent },
  { path: 'accounts', component: AccountsListComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
];