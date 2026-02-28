import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [AccountService, TransactionService],
  imports: [CommonModule, NgChartsModule],
  styleUrls: ['./dashboard.component.css']   // <-- IMPORTANT
})
export class DashboardComponent implements OnInit {

  public pieChartType: ChartType = 'pie';

  public pieChartData: any; 
  accounts: any[] = [];
  transactions: any[] = [];
  monthlyLabels: string[] = [];
  monthlyIncome: number[] = [];
  monthlyExpenses: number[] = [];

  categoryLabels: string[] = [];
  categoryColors: string[] = [];
  categoryData: number[] = [];

  totalBalance = 0;
  income = 0;
  expenses = 0;
  categoryPercentages: number[] = [];

  constructor(
    private accountsService: AccountService,
    private transactionsService: TransactionService
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {

    this.accounts = await this.accountsService.getAccounts();
    this.transactions = await this.transactionsService.getTransactions();

    this.calculateStats();
  }

  calculateStats() {

    this.totalBalance = this.accounts.reduce(
      (sum, acc) => sum + Number(acc.balance || 0),
      0
    );

    this.income = 0;
    this.expenses = 0;

    const monthlyMap: any = {};
    const categoryMap: any = {};

    for (const t of this.transactions) {

      const amount = Number(t.amount);
      const date = new Date(t.date);
      const month = date.toLocaleString('default', { month: 'short' });

      if (!monthlyMap[month]) {
        monthlyMap[month] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        this.income += amount;
        monthlyMap[month].income += amount;
      } else {
        this.expenses += amount;
        monthlyMap[month].expense += amount;

        const category = t.categories?.name ?? 'Other';

        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }

        categoryMap[category] += amount;
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
}