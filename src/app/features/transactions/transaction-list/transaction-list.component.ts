import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./transaction-list.component.css'],
  template: `
    <div class="page">

  <h2>Transactions</h2>

  <div class="tx-card"
       *ngFor="let tx of transactions">

    <div class="tx-left">

      <div class="tx-title">
        {{ tx.categories?.name || 'Uncategorized' }}
      </div>

      <div class="tx-meta">
        {{ tx.accounts?.name }}
        •
        {{ tx.description || 'No description' }}
        •
        {{ tx.occurred_at | date:'mediumDate' }}
      </div>

    </div>

    <div class="tx-right">

      <div
        class="amount"
        [class.income]="tx.type === 'income'"
        [class.expense]="tx.type === 'expense'">

        {{ tx.type === 'expense' ? '-' : '+' }}
        {{ tx.amount | currency: 'RON' }}

      </div>

      <div class="actions">
        <button (click)="editTransaction(tx)">Edit</button>
        <button class="delete" (click)="deleteTransaction(tx.id)">Delete</button>
      </div>

    </div>

  </div>

</div>
  `,
})
export class TransactionListComponent implements OnInit {

editTransaction(_t5: any) {
throw new Error('Method not implemented.');
}
  transactions: any = [];

  constructor(private transactionService: TransactionService) {}

  async ngOnInit() {
    this.transactions = await this.transactionService.getTransactions();
  }

  async deleteTransaction(id: any) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    await this.transactionService.deleteTransaction(id);
    this.transactions = this.transactions.filter((tx: any) => tx.id !== id);
  }

}