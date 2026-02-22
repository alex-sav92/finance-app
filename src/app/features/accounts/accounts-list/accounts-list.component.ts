// src/app/features/accounts/accounts-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account, AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule],
  providers: [AccountService],
  template: `
    <h3>Accounts</h3>
    <ul>
      <li *ngFor="let acc of accounts">
        {{ acc.name }} 
      </li>
    </ul>
  `,
})
export class AccountsListComponent implements OnInit {

  accounts: any[] = [];

  constructor(private accountService: AccountService) {}

  async ngOnInit() {
    this.accounts = await this.accountService.getAccounts();
  }
}