import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  async signIn(email: string) {
    return supabase.auth.signInWithOtp({ email });
  }

  async logout() {
    return supabase.auth.signOut();
  }

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }
}