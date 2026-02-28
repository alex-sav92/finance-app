// src/app/features/accounts/accounts-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [AccountService],
  styleUrls: ['./accounts-list.component.css'],
  template: `
      <!-- <h3>Accounts</h3>
      <ul>
        <li *ngFor="let acc of accounts">
          {{ acc.name }} 
        </li>
      </ul> -->
      <div class="page">
    
      <h3>Settings and preferences</h3>
      <label class="checkbox-container">
        <input
          type="checkbox"
          [(ngModel)]="showBalance"
          name="showBalance"
        />
        <span class="custom-checkbox"></span>
        Show Balance
      </label>
      <label class="checkbox-container">
        <input
          type="checkbox"
          [(ngModel)]="showInsights"
          name="showInsights"
        />
        <span class="custom-checkbox"></span>
        Show Insights
      </label>
      <label class="checkbox-container">
        <input
          type="checkbox"
          [(ngModel)]="setDefaultCategory"
          name="setDefaultCategory"
        />
        <span class="custom-checkbox"></span>
        Set Default Category
      </label>
    </div>
  `,
})
export class AccountsListComponent implements OnInit {

  accounts: any[] = [];
  showBalance = false;
showInsights: any;
setDefaultCategory: any;

  constructor(private accountService: AccountService) {}

  async ngOnInit() {
    this.accounts = await this.accountService.getAccounts();
  }
}