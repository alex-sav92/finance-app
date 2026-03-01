import { Component } from '@angular/core';
import { PreferencesService } from '../../services/preferences.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  imports: [FormsModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent {
  preferences: any = {
    currency: 'RON',
    monthly_budget: 0,
    dark_mode: false,
    default_category: 'Food'
  };

  constructor(private preferencesService: PreferencesService){}

  async ngOnInit() {
    const { data } = await this.preferencesService.getPreferences();

    if (data) {
      this.preferences = data;
    }
  }

  async save() {
    await this.preferencesService.updatePreferences(this.preferences);
  }

}
