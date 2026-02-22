// src/app/features/transactions/add-transaction.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3>Add Transaction</h3>
    <form (ngSubmit)="submit()">
      <input [(ngModel)]="categoryId" name="category" placeholder="Category ID" />
      <input type="number" [(ngModel)]="amount" name="amount" placeholder="Amount" required />
      <input [(ngModel)]="note" name="note" placeholder="Note" />
      <input type="date" [(ngModel)]="occurred_at" name="occurred_at" />
      <button type="submit">Add</button>
    </form>
  `,
})
export class AddTransactionComponent {
  accountId = '';
  categoryId = '';
  amount = 0;
  note = '';
  occurred_at = new Date().toISOString().split('T')[0];

  constructor(private transactionService: TransactionService) {}

  async submit() {
    await this.transactionService.createTransaction({
      account_id: this.accountId,
      category_id: this.categoryId || null,
      amount: this.amount,
      note: this.note,
      occurred_at: this.occurred_at,
    });
    alert('Transaction added!');
  }
}