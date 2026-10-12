import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { CategoriesService } from '../../categories/categories.service';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../core/auth.service';
import { PreferencesService } from '../../../services/preferences.service';

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
  filteredCategories: any[] = [];

  amount: number | null = null;
  selectedAccountId: string = '';
  categoryId: string = '';
  note: string = '';
  occurred_at: string = new Date().toISOString().substring(0, 10);
  selectedTransactionType: string = 'expense';

  loading = false;
  message = '';

  constructor(
    private accountsService: AccountService,
    private categoriesService: CategoriesService,
    private transactionsService: TransactionService,
    private authservice: AuthService,
    private preferencesService: PreferencesService
  ) {}

  async ngOnInit() {
    this.accounts = await this.accountsService.getAccounts();
    this.categories = await this.categoriesService.getCategories();
    this.filterCategories(this.selectedTransactionType);
    this.setDefaultsFromPreferences();
  }

  filterCategories(type: string) {
    const isIncome = type.toLowerCase() === 'income';

    this.filteredCategories = this.categories.filter(
      category => category.is_income === isIncome
    );
    this.setDefaultsFromPreferences();
  }

  async setDefaultsFromPreferences() {
    const { data } = await this.preferencesService.getPreferences();
    if (data?.default_category_id && this.selectedTransactionType === 'expense') {
      const categoryExists = this.categories.find(c => c.id === data.default_category_id);
      if (categoryExists) {
        this.categoryId = categoryExists.id;
      }
    }
    if (this.selectedTransactionType.toLowerCase() === 'income') {
      this.categoryId = this.categories.find(c => c.name.toLowerCase() === 'income')?.id || '';
    }
    if (data?.default_account_id) {
      const accountExists = this.accounts.find(c => c.id === data.default_account_id);
      if (accountExists) {
        this.selectedAccountId = accountExists.id;
      }
    }
  }

  async submit() {
    if (!this.amount || !this.selectedAccountId) {
      this.message = 'Please fill required fields';
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      await this.transactionsService.createTransaction({
        amount: this.amount,
        type: this.selectedTransactionType,
        account_id: this.selectedAccountId,
        category_id: this.categoryId || null,
        note: this.note || null,
        occurred_at: this.occurred_at,
        user_id: await this.authservice.getCurrentUserId()
      })

      this.message = 'Transaction added ✅';
      //success message clears after 2 seconds
      setTimeout(() => {
        this.message = '';
      }, 2000);

      this.resetForm();

    } catch (err: any) {
      this.message = err.message;
    }

    this.loading = false;
  }

  resetForm() {
    this.amount = null;
    this.note = '';
    this.setDefaultsFromPreferences();
  }

}