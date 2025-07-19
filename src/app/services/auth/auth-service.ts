import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
export interface JwtPayload {
  sub: string;
  roles: string[];
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN = 'jwt';
  setToken(token: string) {
    sessionStorage.setItem(this.TOKEN, token);
  }
  getToken(): string | null {
    console.log(sessionStorage.getItem(this.TOKEN));
    return sessionStorage.getItem(this.TOKEN);
  }
  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const decoded = jwtDecode<any>(token);

    if (typeof decoded.role === 'string') return [decoded.role];

    if (Array.isArray(decoded.role)) return decoded.role;

    return [];
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = jwtDecode<any>(token);
    if (typeof decoded.role === 'string') {
      return decoded.role === role;
    }

    if (Array.isArray(decoded.role)) {
      return decoded.role.includes(role);
    }

    return false;
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = jwtDecode<any>(token);
    return decoded.idUser || null;
  }

  removeToken(): void {
    sessionStorage.removeItem(this.TOKEN);
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  constructor() {}
}
