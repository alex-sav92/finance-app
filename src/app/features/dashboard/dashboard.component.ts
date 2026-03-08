import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { UserCurrencyPipe } from '../../user-currency.pipe';
import { PreferencesService } from '../../services/preferences.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [AccountService, TransactionService],
  imports: [CommonModule, NgChartsModule, UserCurrencyPipe],
  styleUrls: ['./dashboard.component.css']  
})
export class DashboardComponent implements OnInit {

  public pieChartType: ChartType = 'pie';
  monthlyBudget = 0;
  budgetRemaining = 0;
  budgetUsedPercent = 0;
  public pieChartData: any; 
  public insights: any = {};
  accounts: any[] = [];
  transactions: any[] = [];
  monthlyLabels: string[] = [];
  monthlyIncome: number[] = [];
  monthlyExpenses: number[] = [];

  categoryLabels: string[] = [];
  categoryColors: string[] = [];
  categoryData: number[] = [];

  totalBalance = 0;
  incomeThisMonth = 0;
  expensesThisMonth = 0;
  categoryPercentages: number[] = [];
  currentMonthSpending: any;
  averageMonthlySpending: number = 0;
  categoryComparison: { category: string; current: number; previous: number; diff: number; percent: string | number; }[] = [];

  constructor(
    private accountsService: AccountService,
    private transactionsService: TransactionService,
    private preferencesService: PreferencesService
  ) {}

  async ngOnInit() {
    await this.loadPreferences();
    await this.loadData();
  }

  async loadData() {

    this.accounts = await this.accountsService.getAccounts();
    this.transactions = await this.transactionsService.getTransactions();

    this.calculateMonthStats();
    //await this.calculateInsights();
  }

  calculateMonthStats() {

    this.totalBalance = this.accounts.reduce(
      (sum, acc) => sum + Number(acc.balance || 0),
      0
    );

    this.incomeThisMonth = 0;
    this.expensesThisMonth = 0;

    const monthlyMap: any = {};
    const categoryMap: any = {};
    const now = new Date();
    for (const t of this.transactions) {
      const occurred_at = new Date(Date.parse(t.occurred_at));
      const isThisMonth = occurred_at.getMonth() === now.getMonth() && occurred_at.getFullYear() === now.getFullYear();
      if (!isThisMonth)
        continue;
      // key is Month-Year, with month from 1-12
      const key = `${occurred_at.getMonth() + 1}-${occurred_at.getFullYear()}`;
      const amount = Number(t.amount);
      if (!monthlyMap[key]) {
        monthlyMap[key] = { income: 0, expense: 0 };
      }
      
      if (t.type === 'income') {
        this.incomeThisMonth += amount;
        monthlyMap[key].income += amount;
      } else {
        this.expensesThisMonth += amount;
        monthlyMap[key].expense += amount;

        const category = t.categories?.name ?? 'Other';
        if (!categoryMap[category]) {
            categoryMap[category] = 0;
        }
        if (now.getMonth() === occurred_at.getMonth() && now.getFullYear() === occurred_at.getFullYear()) {
          categoryMap[category] += amount;
        }
      }
    }

    this.monthlyLabels = Object.keys(monthlyMap);

    this.monthlyIncome = this.monthlyLabels.map(
      m => monthlyMap[m].income
    );

    this.monthlyExpenses = this.monthlyLabels.map(
      m => monthlyMap[m].expense
    );

    this.categoryLabels = Object.keys(categoryMap);
    this.categoryData = Object.values(categoryMap);

    const sumSpending = this.categoryData.reduce((a, b) => a + b, 0);
    this.categoryPercentages = this.categoryData.map(d => (d / sumSpending) * 100);

    this.categoryColors = [
      '#ef4444',
      '#f97316', 
      '#eab308', 
      '#22c55e',
      '#06b6d4',
      '#3b82f6',
      '#8b5cf6', 
      '#ec4899', 
      '#14b8a6',
      '#64748b'  
    ];

  this.pieChartData = {
    labels: this.categoryLabels,
    datasets: [
      {
        data: this.categoryData,
        backgroundColor: this.categoryColors
      }
    ]
  };
}
 calculateInsights() {
  if (!this.transactions.length) return;

  const groupedByMonth: Record<string, number> = {};
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth() +1}`;
  console.log('Current month key:', currentMonthKey);
  const previousMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

  const categoryCurrent: Record<string, number> = {};
  const categoryPrevious: Record<string, number> = {};

  this.transactions.forEach(tx => {
    const date = new Date(tx.created_at);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    // --- Monthly totals
    groupedByMonth[monthKey] =
      (groupedByMonth[monthKey] || 0) + (tx.type === 'expense' ? tx.amount : 0);

    // --- Current month total
    if (monthKey === currentMonthKey) {
      this.currentMonthSpending += tx.amount; 
      categoryCurrent[tx.category] =
        (categoryCurrent[tx.category] || 0) + tx.amount;
      console.log(`Added ${tx.amount} to currentMSpend: ${this.currentMonthSpending}`);
    }

    // --- Previous month
    if (monthKey === previousMonthKey) {
      categoryPrevious[tx.category] =
        (categoryPrevious[tx.category] || 0) + tx.amount;
    }
  });

  const months = Object.keys(groupedByMonth).length;
  const totalSpending = Object.values(groupedByMonth)
    .reduce((a, b) => a + b, 0);

  this.averageMonthlySpending = totalSpending / months;

  // --- Category comparison
  this.categoryComparison = Object.keys(categoryCurrent).map(cat => {
    const current = categoryCurrent[cat] || 0;
    const previous = categoryPrevious[cat] || 0;
    const diff = current - previous;
    const percent = previous
      ? ((diff / previous) * 100).toFixed(1)
      : 100;

    return {
      category: cat,
      current,
      previous,
      diff,
      percent
    };
  });

  if (this.monthlyBudget > 0) {
    console.log('Current spent:', this.currentMonthSpending);
  this.budgetRemaining =
    this.monthlyBudget - this.currentMonthSpending;
    console.log('Calculated budget remaining:', this.budgetRemaining);

  this.budgetUsedPercent =
    (this.currentMonthSpending / this.monthlyBudget) * 100;
  }
}

  async loadPreferences() {
    const { data } = await this.preferencesService.getPreferences();
    if (data?.monthly_budget) {
      this.monthlyBudget = Number(data.monthly_budget);
    }
  }
}
