import{AuthService} from '../services/auth/auth-service';
import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  console.log(
    'AuthInterceptor: ',
    req.url,
    authToken
  )
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });
  return next(authReq);
};

