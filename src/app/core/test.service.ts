import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  async testConnection() {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    return data;
  }
}