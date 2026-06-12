import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  
  async getInstallments() {
      
      const { data, error } = await supabase
        .from('credit')
        .select('*')
        .order('due_date', { ascending: true });
  
      if (error) throw error;
      return data ?? [];
    }

  async togglePaid(id: string, paid: boolean) {
    const { error } = await supabase.from('credit')
      .update({
        paid: true
      })
      .eq('id', id);

      if (error) throw error;
  }
}
