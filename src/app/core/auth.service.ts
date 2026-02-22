// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User | null = null;

  constructor() {}

  // Login via magic link
  async login(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    this.user = null;
  }

  async getUser() {
    const { data } = await supabase.auth.getUser();
    this.user = data.user;
    return data.user;
  }
}