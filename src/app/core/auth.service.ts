// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 
  async login(email: string, password: string) {

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return data;
  }
   async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  async getCurrentUserId() {
    const user = await this.getUser();
    return user?.id;
  }

  async logout() {
    await supabase.auth.signOut();
  }
  async register(email: string, password: string) {

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    return data;
  }
}