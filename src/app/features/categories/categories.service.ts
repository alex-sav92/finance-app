import { Injectable } from '@angular/core';
import { supabase } from '../../core/supabase.client';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  async getCategories() {

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    return data ?? [];
  }

}