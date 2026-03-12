import { Injectable } from '@angular/core';
import { supabase } from '../../core/supabase.client';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  async getAccounts() {

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('name');

    if (error) throw error;

    return data ?? [];
  }

}