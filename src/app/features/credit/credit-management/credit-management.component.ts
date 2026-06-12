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
  
  constructor(private creditService: CreditService) {}
  async ngOnInit() {
    this.installments = await this.creditService.getInstallments();
    this.sumLeftToPay = this.installments.reduce((sum: number, i: Installment) => sum + (i.paid ? 0 : i.amount+ i.insurance), 0);
    this.sumLeftToPayPrincipalOnly = this.installments.reduce((sum: number, i: Installment) => sum + (i.paid ? 0 : i.principal_part), 0);
    this.countLeftToPay = this.installments.filter((i: Installment) => !i.paid).length;
  }

  async togglePaid(installment: Installment) {
    await this.creditService.togglePaid(installment.id, installment.paid);
    // Refresh the installments list to reflect the updated status
    this.installments = await this.creditService.getInstallments();
  }
}
