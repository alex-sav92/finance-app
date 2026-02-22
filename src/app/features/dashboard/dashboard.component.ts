import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [AccountService, TransactionService],
})
export class DashboardComponent implements OnInit {

  accounts: any[] = [];
  transactions: any[] = [];

  totalBalance = 0;
  income = 0;
  expenses = 0;

  constructor(
    private accountsService: AccountService,
    private transactionsService: TransactionService
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {

    this.accounts = await this.accountsService.getAccounts();
    this.transactions = await this.transactionsService.getTransactions();

    this.calculateStats();
  }

  calculateStats() {

    this.totalBalance = this.accounts.reduce(
      (sum, acc) => sum + Number(acc.balance || 0),
      0
    );

    this.income = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    this.expenses = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

}