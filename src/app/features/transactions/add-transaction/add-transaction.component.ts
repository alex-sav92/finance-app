import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { CategoriesService } from '../../categories/categories.service';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [AccountService, CategoriesService, TransactionService],
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {

  accounts: any[] = [];
  categories: any[] = [];

  amount: number | null = null;
  type: string = 'expense';
  accountId: string = '';
  categoryId: string = '';
  note: string = '';
  occurred_at: string = new Date().toISOString().substring(0, 10);

  loading = false;
  message = '';

  constructor(
    private accountsService: AccountService,
    private categoriesService: CategoriesService,
    private transactionsService: TransactionService,
    private authservice: AuthService
  ) {}

  async ngOnInit() {
    this.accounts = await this.accountsService.getAccounts();
    this.categories = await this.categoriesService.getCategories();
  }

  async submit() {

    if (!this.amount || !this.accountId) {
      this.message = 'Please fill required fields';
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      await this.transactionsService.createTransaction({
        amount: this.amount,
        type: this.type,
        account_id: this.accountId,
        category_id: this.categoryId || null,
        note: this.note || null,
        occurred_at: this.occurred_at,
        user_id: await this.authservice.getCurrentUserId()
      })

      this.message = 'Transaction added ✅';

      this.resetForm();

    } catch (err: any) {
      this.message = err.message;
    }

    this.loading = false;
  }

  resetForm() {
    this.amount = null;
    this.note = '';
    this.categoryId = '';
  }

}