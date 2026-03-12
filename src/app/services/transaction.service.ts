import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  async getTransactions() {

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