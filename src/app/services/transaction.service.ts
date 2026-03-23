import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  async getTransactions(fromDate?: Date | undefined, toDate?: Date | undefined, type: string = 'expense') {
    const maxDate = new Date();
    const minDate = new Date(2000, 0, 1);
    const strFromDate = fromDate ? this.constformatDate(fromDate) : this.constformatDate(minDate);
    const strToDate = toDate ? this.constformatDate(toDate) : this.constformatDate(maxDate);

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        accounts (
          id,
          name
        ),
        categories (
          name
        )
      `)
      .eq('type', type)
      .gte('occurred_at', strFromDate)
      .lte('occurred_at', strToDate)
      .order('occurred_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }
  
  async createTransaction(tx: any) {

    const { error } = await supabase
      .from('transactions')
      .insert([tx]);

    if (error) throw error;
  }

  async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updateTransaction(id: string, amount: number, category_id: any, note: any) {
    const { error } = await supabase.from('transactions')
      .update({
        amount: amount,
        category_id: category_id,
        note: note
      })
      .eq('id', id);

      if (error) throw error;
  }

  constformatDate = (d: Date) => {
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }

}