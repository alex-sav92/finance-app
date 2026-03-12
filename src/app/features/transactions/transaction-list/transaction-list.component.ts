import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';
import { UserCurrencyPipe } from '../../../user-currency.pipe';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../categories/categories.service';
@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, UserCurrencyPipe, FormsModule],
  styleUrls: ['./transaction-list.component.css'],
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent implements OnInit {

  editingTransactionId: string | null = null;
  editAmount: number | null = null;
  editCategoryId: string | null = null;
  editNote: string = '';
  categories: any;

  editTransaction(_t5: any) {
    throw new Error('Method not implemented.');
  }
  transactions: any = [];

  constructor(private transactionService: TransactionService, private categoriesService: CategoriesService) {}

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

  async startEdit(tx: any) {
    this.editingTransactionId = tx.id;
    this.editAmount = tx.amount;
    this.editCategoryId = tx.category_id;
    this.editNote = tx.note || '';
    this.categories = await this.categoriesService.getCategories();
  }
  cancelEdit(){
    this.editingTransactionId = null;
  }
  async saveEdit(tx:any) {
    this.transactionService.updateTransaction(tx.id, this.editAmount!, this.editCategoryId!, this.editNote);
    this.editingTransactionId = null;
    //refresh list
    this.transactions = await this.transactionService.getTransactions();
  }
}