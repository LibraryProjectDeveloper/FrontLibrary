import {ActivatedRouteSnapshot, CanActivateFn,Router} from '@angular/router';
import {AuthService} from '../services/auth/auth-service';
import {inject} from '@angular/core';

export const authGuard:CanActivateFn =(route: ActivatedRouteSnapshot)=> {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  const expectRoles: string[] = route.data['roles'];
  if (expectRoles && expectRoles.length > 0) {
    const userRoles = authService.getUserRoles();
    const hasAccess = expectRoles.some(role => userRoles.includes(role));

    if (!hasAccess) {
      router.navigate(['/unauthorized']);
      return false;
    }
  }
  return true;
};
