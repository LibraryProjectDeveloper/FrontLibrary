import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  onSubmit() {
    const data: any = this.loginForm.value;
    this.errorMessage = ' ';
    this.http.post('http://localhost:8080/api/auth/login', data).subscribe({
      next: (response: any) => {
        console.log(response);
        this.authService.setToken(response.token);
        setTimeout(() => {
          if (
            this.authService.hasRole('ROLE_ADMIN') ||
            this.authService.hasRole('ROLE_LIBRARIAN')
          ) {
            this.router.navigate(['/panel']);
          } else {
            this.errorMessage = 'No tienes los permisos necesarios';
          }
        }, 100);
      },
      error: () => {
        this.errorMessage = 'Credenciales incorrectas';
      },
    });
  }
  errorMessage: string = '';
}
