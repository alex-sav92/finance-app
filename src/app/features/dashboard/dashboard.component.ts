import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { UserCurrencyPipe } from '../../user-currency.pipe';
import { PreferencesService } from '../../services/preferences.service';
import { ExpenseCategory } from '../../utils';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';

Chart.register(ChartDataLabels);

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
  averageMonthlySpending: number = 0;
  categoryComparison: any = [];

  dailyBudget: number = 0;
  maxExpenseThisMonth = 0;
  maxExpenseCategory = '';
  chartOptions: any = {};
  spentToday: number = 0;
  show_budget: boolean = true;

  constructor(
    private accountsService: AccountService,
    private transactionService: TransactionService,
    private preferencesService: PreferencesService
  ) {}

  async ngOnInit() {
    await this.loadPreferences();
    await this.loadData();
  }

  async loadData() {

    this.accounts = await this.accountsService.getAccounts();
    
    this.calculateMonthStats();
    this.comparePastMonth();
  }

  async calculateMonthStats() {
    const now = new Date();
    let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.transactions = await this.transactionService.getTransactions(startOfMonth, today);

    this.expensesThisMonth = 0;
    this.maxExpenseThisMonth = 0;
    const categoryMap: any = {};
    
    for (const t of this.transactions) {
      const occurred_at = new Date(Date.parse(t.occurred_at));
      
      // key is Month-Year, with month from 1-12
      const key = `${occurred_at.getMonth() + 1}-${occurred_at.getFullYear()}`;
      const amount = Number(t.amount);
      
      if (t.type === 'income') {
        this.incomeThisMonth += amount;
      } else {
        this.expensesThisMonth += amount;
        if (occurred_at.getDate() === now.getDate()) {
          this.spentToday += amount;
        }

        const category = t.categories?.name ?? 'Other';
        if (!categoryMap[category]) {
            categoryMap[category] = 0;
        }

        categoryMap[category] += amount;
        if (amount > this.maxExpenseThisMonth && 
            category !== ExpenseCategory.Economii && category !== ExpenseCategory.Rata) {
          this.maxExpenseThisMonth = amount;
          this.maxExpenseCategory = category;
        }
      }

    this.categoryLabels = Object.keys(categoryMap);
    this.categoryData = Object.values(categoryMap);

    const sumSpending = this.categoryData.reduce((a, b) => a + b, 0);
    this.categoryPercentages = this.categoryData.map(d => (d / sumSpending) * 100);

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          color: '#fff',
          font: {
            weight: 'bold',
            size: 12
          },
          formatter: (value:number, context: Context) => {
            const data = context.chart.data.datasets[0].data as number[];
            const total = data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return percentage + '%';
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            boxWidth: 14,
            font: { size: 13}
          }
        }
      }
    }

    this.categoryColors = [
      '#d60909',
      '#f97316',
      '#ec4899',
      '#eab308', 
      '#22c55e',
      '#06b6d4',
      '#3b82f6',
      '#8b5cf6', 
      '#14b8a6',
      '#64748b',
      '#3716b2', 
      '#2b9b8e'
    ];
  const shuffle = (arr: string[]) => {
    arr.sort(() => Math.random() - 0.5);
  }
  shuffle(this.categoryColors);

  this.pieChartData = {
    labels: this.categoryLabels,
    datasets: [
      {
        data: this.categoryData,
        backgroundColor: this.categoryColors,
        borderWidth: 2,
        borderRadius: 6,
        spacing: 4
      }
    ]
  };
  }
}

async comparePastMonth() {
  const now = new Date();
  let startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  this.transactions = await this.transactionService.getTransactions(startDate, endDate);

  if (!this.transactions.length) return;

  const groupedByMonth: Record<string, number> = {};
  const currentMonthKey = `${now.getMonth()+1}-${now.getFullYear()}`;
  const previousMonthKey = `${now.getMonth()}-${now.getFullYear()}`

  const categoryCurrentMonth: Record<string, number> = {};
  const categoryPreviousMonth: Record<string, number> = {};

  for (const tx of this.transactions) {
    const occurred_at = new Date(Date.parse(tx.occurred_at));
    // key is Month-Year, with month from 1-12
    const monthKey = `${occurred_at.getMonth()+1}-${occurred_at.getFullYear()}`;
    // --- Monthly totals
    groupedByMonth[monthKey] =
      (groupedByMonth[monthKey] || 0) + (tx.type === 'expense' ? tx.amount : 0);

    const category = tx.categories?.name ?? 'Other';
    // --- Current month total
    if (monthKey === currentMonthKey) {
      categoryCurrentMonth[category] =
        (categoryCurrentMonth[category] || 0) + tx.amount;
    }

    // --- Previous month
    if (monthKey === previousMonthKey) {
      categoryPreviousMonth[category] =
        (categoryPreviousMonth[category] || 0) + tx.amount;
    }
  };

  const months = Object.keys(groupedByMonth).length;
  const totalSpending = Object.values(groupedByMonth).reduce((a, b) => a + b, 0);

  this.averageMonthlySpending = totalSpending / months;

  // --- Category comparison
  this.categoryComparison = Object.keys(categoryCurrentMonth).map(cat => {
    const current = categoryCurrentMonth[cat] || 0;
    const previous = categoryPreviousMonth[cat] || 0;
    if (!current || !previous) return null;   // remove missing data
    
    const diff = current - previous;
    const percentChange = diff > 0 ? '+' +(diff / previous * 100).toFixed(1) : ((diff / previous) * 100).toFixed(1);
    return {
      category: cat,
      current,
      previous,
      diff,
      percent: percentChange + '%'
    };
  }).filter(Boolean) // remove nulls;

  if (this.monthlyBudget > 0) {
    this.budgetRemaining = this.monthlyBudget - this.expensesThisMonth;
    let lastDayThisMonth = (now.getMonth() === 3 || now.getMonth() === 5 || 
      now.getMonth() === 8 || now.getMonth() === 10) ?
     30 : 31;
    if (now.getMonth() === 1) lastDayThisMonth = 28;
    const daysLeft = lastDayThisMonth - now.getDate() + 1; // add one for current day
    this.dailyBudget = daysLeft > 0 ? this.budgetRemaining / daysLeft : 0;

  this.budgetUsedPercent =
    (this.expensesThisMonth / this.monthlyBudget) * 100;
  }
}

  async loadPreferences() {
    const { data } = await this.preferencesService.getPreferences();
    if (data?.monthly_budget) {
      this.monthlyBudget = Number(data.monthly_budget);
    }
    if (data?.show_budget){
      console.log('show budget', data.show_budget);
      this.show_budget = data.show_budget;
    }
  }
}
