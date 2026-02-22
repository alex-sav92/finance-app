// src/app/features/transactions/transactions-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Transactions</h3>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let tx of transactions">
          <td>{{ tx.occurred_at | date:'shortDate' }}</td>
          <td>{{ tx.categories.name ?? 'Uncategorized' }}</td>
          <td>{{ tx.amount }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class TransactionsListComponent implements OnInit {
  transactions: any = [];

  constructor(private transactionService: TransactionService) {}

  async ngOnInit() {
    this.transactions = await this.transactionService.getTransactions();
  }
}