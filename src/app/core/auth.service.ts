// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 
  async login(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
    return data;
  }
   async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  async logout() {
    await supabase.auth.signOut();
  }
}