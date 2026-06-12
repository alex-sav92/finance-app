import { Component } from '@angular/core';
import { UserCurrencyPipe } from "../../../user-currency.pipe";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreditService } from '../../../services/credit.service';
interface Installment {
  id: string;
  due_date: string;
  amount: number;
  principal_part: number;
  insurance: number;
  paid: boolean;
}
@Component({
  selector: 'app-credit-management',
  imports: [UserCurrencyPipe, CommonModule, FormsModule],
  templateUrl: './credit-management.component.html',
  styleUrl: './credit-management.component.css'
})
export class CreditManagementComponent {
  installments: any = [];
  sumLeftToPay: number = 0;
  countLeftToPay: number = 0;
  sumLeftToPayPrincipalOnly: number = 0;
  nextMonthPrincipal = 0;
  nextMonthTotal: any;
  next2MonthsPrincipal = 0;
  next2MonthsTotal = 0;
  next4MonthsPrincipal = 0;
  next4MonthsTotal = 0;
  
  constructor(private creditService: CreditService) {}
  async ngOnInit() {
    this.installments = await this.creditService.getInstallments();
    this.sumLeftToPay = this.installments.reduce((sum: number, i: Installment) => sum + (i.paid ? 0 : i.amount+ i.insurance), 0);
    this.sumLeftToPayPrincipalOnly = this.installments.reduce((sum: number, i: Installment) => sum + (i.paid ? 0 : i.principal_part), 0);
    this.countLeftToPay = this.installments.filter((i: Installment) => !i.paid).length;
    this.computeTips();
  }

  computeTips(){
    this.nextMonthPrincipal = this.installments.find((i: any) => !i.paid)?.principal_part ?? 0;
    this.nextMonthTotal = this.installments.find((i: any) => !i.paid)?.amount ?? 0;
    this.nextMonthTotal += this.installments.find((i: any) => !i.paid)?.insurance ?? 0;

    this.next2MonthsPrincipal = this.nextXPrincipalParts(2);
    this.next2MonthsTotal = this.nextXAmounts(2) + this.nextXInsurances(2);

    this.next4MonthsPrincipal = this.nextXPrincipalParts(4);
    this.next4MonthsTotal = this.nextXAmounts(4) + this.nextXInsurances(4);
  }

  nextXPrincipalParts(x: number): number {
    return this.installments
      .filter((i: any) => !i.paid)
      .slice(0, x)
      .reduce(
        (sum: number, i: any) => sum + (i.principal_part ?? 0),
        0
      );
  }
  nextXInsurances(x: number): number {
    return this.installments
      .filter((i: any) => !i.paid)
      .slice(0, x)
      .reduce(
        (sum: number, i: any) => sum + (i.insurance ?? 0),
        0
      );
  }
  nextXAmounts(x: number): number {
    return this.installments
      .filter((i: any) => !i.paid)
      .slice(0, x)
      .reduce(
        (sum: number, i: any) => sum + (i.amount ?? 0),
        0
      );
  }

  async togglePaid(installment: Installment) {
    await this.creditService.togglePaid(installment.id, installment.paid);
    // Refresh the installments list to reflect the updated status
    this.installments = await this.creditService.getInstallments();
  }
}
