import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(private fb:FormBuilder,private http:HttpClient) {
    this.loginForm = this.fb.group({
      email:[''],
      password:['']
    })
  }
  onSubmit(){
    const data : any = this.loginForm.value;
    this.http.post('http://localhost:8080/api/auth/login',data)
      .subscribe({
        next: (response:any) =>{
          console.log(response);
          sessionStorage.setItem('jwt',response)
        },
        error: () => {
          this.errorMessage = 'Credenciales incorrectas'
        }
      })
  }
  errorMessage: string = '';
}
