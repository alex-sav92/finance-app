import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  async getTransactions(fromDate?: Date | undefined, toDate?: Date | undefined) {
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

  async closeMonth() {
    var now = new Date();
    var firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    var lastDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    var transactions = await this.getTransactions(firstDayOfCurrentMonth, lastDayOfCurrentMonth);
    let sumFoodGroceries, sumFoodOut, sumFoodUnknown = 0;
    let sumsCategories: any = {};
    let account_id = transactions[0].account_id, user_id = transactions[0].user_id;
    for(const tx of transactions) {
      if (tx.type === 'income') 
        continue;
      if (tx.category == 'Food') {
        if (tx.note.toLowerCase().includes('groceries')) {
          sumFoodGroceries += tx.amount;
        }
        else if (tx.note.toLowerCase().includes('oras')) {
          sumFoodOut += tx.amount;
        }
        else {
          sumFoodUnknown += tx.amount;
        }
      } else {
        if (!sumsCategories[tx.category]) {
          sumsCategories[tx.category] = 0;
        }
        sumsCategories[tx.category] += tx.amount;
      }
      this.deleteTransaction(tx.id);
      tx.accout_id = null;
    }

    // deleted all transactions, add just one with the summed amounts for each category
    for (const category in sumsCategories) {
      await this.createTransaction({
        category: category,
        amount: sumsCategories[category],
        type: 'expense',
        occurred_at: this.constformatDate(lastDayOfCurrentMonth),
        note: 'Closed month - ' + category,
        user_id: user_id,
        account_id: account_id
      });
    }
    await this.createTransaction({
      category: 'Food',
      amount: sumFoodGroceries,
      type: 'expense',
      occurred_at: this.constformatDate(lastDayOfCurrentMonth),
      note: 'Closed month - Food',
      user_id: user_id,
      account_id: account_id
    });
}