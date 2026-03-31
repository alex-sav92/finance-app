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
  sumfiltered = 0;
  categories: any;
  filters = {
    categoryId: '',
    note: '',
    fromDate: '',
    toDate: '',
    preset: '',
    minAmount: null as number | null,
    maxAmount: null as number | null
  };

  transactions: any = [];
  transactionsFiltered: any[] = [];

  constructor(private transactionService: TransactionService, private categoriesService: CategoriesService) {}

  async ngOnInit() {
    this.transactions = await this.transactionService.getTransactions();
    this.transactionsFiltered = this.transactions;
    this.applyFilters();
    this.categories = await this.categoriesService.getCategories();
  }
  applyFilters() {
    this.transactionsFiltered = this.transactions.filter((tx: any) => {
      if (tx.type !== 'expense') {
        return false;
      }
      if (this.filters.categoryId && tx.category_id !== this.filters.categoryId){
        return false;
      }

      if (this.filters.note && !tx.note?.toLowerCase().includes(this.filters.note.toLowerCase())){
        return false;
      }

      if (this.filters.fromDate && tx.occurred_at < this.filters.fromDate){
        return false;
      }

      if (this.filters.toDate && tx.occurred_at > this.filters.toDate){
        return false;
      }

      if (this.filters.minAmount != null && tx.amount < this.filters.minAmount){
        return false;
      }

      if (this.filters.maxAmount != null && tx.amount > this.filters.maxAmount) {
        return false;
      }
      
      return true;
    });

    this.sumfiltered = this.transactionsFiltered.reduce((sum, tx) => sum + Number(tx.amount), 0);
  }

  applyPreset(preset: string) {
    const now = new Date();
    const format = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

    let from: Date | null = null;
    let to: Date | null = null;

    if (preset === '7days') {
      from = new Date();
      from.setDate(now.getDate() - 7);
      to = now;
    }

    if (preset === 'thisMonth') {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = now;
    }

    if (preset === '6months') {
      from = new Date(now);
      from.setMonth(now.getMonth() - 6);
      to = now;
    }

    this.filters.fromDate = from ? format(from) : '';
    this.filters.toDate = to ? format(to) : '';

    this.applyFilters();
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

  clearFilters() {
    this.filters = {
      categoryId: '',
      note: '',
      fromDate: '',
      toDate: '',
      preset: '',
      minAmount: null,
      maxAmount: null
    };

    this.applyFilters();
  }
}