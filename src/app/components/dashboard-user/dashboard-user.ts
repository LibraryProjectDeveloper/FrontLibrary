import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Router,
} from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-dashboard-user',
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.scss',
})
export class DashboardUser implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  ngOnInit(): void {}
  logout() {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
