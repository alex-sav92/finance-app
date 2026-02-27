import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/auth.service';
import { RouterLinkActive } from "@angular/router";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  loggedUser: string | null = null;
  constructor(private auth: AuthService) {}

  async ngOnInit() {
    const user = await this.auth.getUser();
    this.loggedUser = user?.email ?? null;
  }
  
  async logout() {
    await this.auth.logout();
    location.reload();
  }

}