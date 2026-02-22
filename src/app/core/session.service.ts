// src/app/core/session.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from './supabase.client';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    // Get initial user on app start
    supabase.auth.getUser().then(({ data }) => {
      this.userSubject.next(data.user ?? null);
    });

    // Listen to auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      this.userSubject.next(session?.user ?? null);
    });
  }

  logout() {
    return supabase.auth.signOut().then(() => this.userSubject.next(null));
  }
}