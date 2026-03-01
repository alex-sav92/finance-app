import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PreferencesService } from './services/preferences.service';

@Pipe({
  name: 'userCurrency',
  standalone: true,
  pure: false // important!
})
export class UserCurrencyPipe implements PipeTransform {

  private currency = 'RON';

  constructor(
    private currencyPipe: CurrencyPipe,
    private preferencesService: PreferencesService
  ) {
    this.loadCurrency();
  }

  async loadCurrency() {
    const { data } = await this.preferencesService.getPreferences();
    if (data?.currency) {
      this.currency = data.currency;
    }
  }

  transform(value: number | null | undefined): string | null {
    if (value == null) return null;

    return this.currencyPipe.transform(
      value,
      this.currency,
      'symbol',
      '1.2-2'
    );
  }
}