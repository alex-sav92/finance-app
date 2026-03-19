import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  async getTransactions(thisMonthAndPastMonthOnly: boolean = false) {
    const now = new Date();
    const maxDate = new Date(2099, 11, 31);
    const minDate = new Date(2000, 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
    startOfMonth.setDate(1); // Set to the first day of the current month
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
      .gte('created_at', thisMonthAndPastMonthOnly ? startOfMonth.toISOString() : minDate.toISOString())
      .lte('created_at', thisMonthAndPastMonthOnly ? endOfMonth.toISOString() : maxDate.toISOString())
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

}