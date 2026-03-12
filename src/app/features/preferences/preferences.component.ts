import { Component } from '@angular/core';
import { PreferencesService } from '../../services/preferences.service';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../categories/categories.service';
import { AccountsService } from '../accounts/accounts.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-preferences',
  imports: [FormsModule, CommonModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent {
  categories: any;
  accounts: any;

  preferences: any = {
    currency: 'RON',
    monthly_budget: 0,
    dark_mode: false,
    default_category_id: '',
    default_account_id: ''
  };

  constructor(private preferencesService: PreferencesService, private categoriesService: CategoriesService, 
    private accountsService: AccountsService){}

  async ngOnInit() {
    const { data } = await this.preferencesService.getPreferences();

    if (data) {
      this.preferences = data;
    }
    this.categories = await this.categoriesService.getCategories();
    this.accounts = await this.accountsService.getAccounts();
  }

  async save() {
    await this.preferencesService.updatePreferences(this.preferences);
  }

}
