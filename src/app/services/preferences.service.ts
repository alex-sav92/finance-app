import { Injectable } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { supabase } from '../core/supabase.client';

@Injectable({ providedIn: 'root' })
export class PreferencesService {

  constructor(private authService: AuthService) {}

  async getPreferences() {
    const userId = await this.authService.getCurrentUserId();

    return supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
  }

  async updatePreferences(data: any) {
    const userId = await this.authService.getCurrentUserId();

    return supabase
      .from('user_preferences')
      .upsert({
        ...data,
        user_id: userId
      });
  }
}