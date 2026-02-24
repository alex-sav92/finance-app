// src/app/core/account.service.ts
import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

export interface Account {
  id: string;
  name: string;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  async getAccounts() {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading accounts:', error);
      throw error;
    }

    return data ?? [];
  }

  async createAccount(name: string, balance: number) {

    const { data: userData } = await supabase.auth.getUser();

    const user = userData.user;

    if (!user) throw new Error('User not logged in');

    const { data, error } = await supabase
      .from('accounts')
      .insert([
        {
          name,
          balance,
          user_id: user.id
        }
      ])
      .select();

    if (error) throw error;

    return data;
  }
}