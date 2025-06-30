import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet,Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth/auth-service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './dashboard.html',
  standalone: true,
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  authService= inject(AuthService);
  router = inject(Router);
  isSidebarVisible = false;
  userRoles: string[] = [];
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  logout(){
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }
}
