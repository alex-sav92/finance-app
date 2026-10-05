import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Context } from 'chartjs-plugin-datalabels';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-monthly-report',
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './monthly-report.component.html',
  styleUrl: './monthly-report.component.css'
})
export class MonthlyReportComponent implements OnInit {
 selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;
@ViewChild('reportContent') reportContent!: ElementRef;
years: number[] = [];
totalIncome = 0;
totalExpenses = 0;
transactionCount = 0;

categoryLabels: string[] = [];
categoryData: number[] = [];
categoryPercentages: number[] = [];

pieChartData: any;
chartOptions: any;
categoryColors: string[] = [];

  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  constructor(private transactionService: TransactionService) {
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 2025; year--) {
      this.years.push(year);
    }
  }
  ngOnInit(): void {
    this.loadReport();
  }

  
async loadReport() {
  const startOfMonth = new Date(
    this.selectedYear,
    this.selectedMonth - 1,
    1
  );

  const endOfMonth = new Date(
    this.selectedYear,
    this.selectedMonth,
    0
  );

  const transactions = await this.transactionService.getTransactions(
    startOfMonth,
    endOfMonth
  );

  this.totalIncome = 0;
  this.totalExpenses = 0;
  this.transactionCount = transactions.length;

  for (const t of transactions) {

    const amount = Number(t.amount);
    if (
      t.type?.toLowerCase() === 'income' ||
      t.categories?.name === 'income'
    ) {
      this.totalIncome += amount;
    } else {
      this.totalExpenses += amount;
    }
  }

  const categoryMap: { [key: string]: number } = {};

  for (const t of transactions) {

    const amount = Number(t.amount);
    // Don't include income in the expense category chart
    if (
      t.type?.toLowerCase() === 'income' ||
      t.categories?.name === 'income'
    ) {
      continue;
    }

    const category = t.categories?.name ?? 'Other';

    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }

    categoryMap[category] += amount;
  }

this.categoryLabels = Object.keys(categoryMap);
this.categoryData = Object.values(categoryMap);

const sumSpending = this.categoryData.reduce(
  (sum, amount) => sum + amount,
  0
);

this.categoryPercentages = sumSpending > 0
  ? this.categoryData.map(
      amount => (amount / sumSpending) * 100
    )
  : [];

this.categoryColors = [
  '#d60909',
      '#f97316',
      '#ec4899',
      '#eab308', 
      '#22c55e',
      '#06b6d4',
      '#3b82f6',
      '#8b5cf6', 
      '#f9acff',
      '#185f80',
      '#64748b',
      '#3716b2', 
      '#b0721a',
      '#000000'
];

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
      formatter: (value: number, context: Context) => {
        const data = context.chart.data.datasets[0].data as number[];

        const total = data.reduce(
          (sum, amount) => sum + Number(amount),
          0
        );

        if (total === 0) {
          return '';
        }

        const percentage = ((value / total) * 100).toFixed(1);

        return percentage + '%';
      }
    },

    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        boxWidth: 14,
        font: {
          size: 13
        }
      }
    }
  }
};

  console.log('Report month:', this.selectedMonth, this.selectedYear);
  console.log('Transactions:', transactions);
}
async exportToPdf() {

  const element = this.reportContent.nativeElement;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#f9fafb'
  });

  const imageData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imageWidth = pageWidth;
  const imageHeight =
    (canvas.height * imageWidth) / canvas.width;

  pdf.addImage(
    imageData,
    'PNG',
    0,
    0,
    imageWidth,
    imageHeight
  );

  pdf.save(
    `monthly-report-${this.selectedYear}-${this.selectedMonth}.pdf`
  );
}
}
