import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN = 'jwt';
  setToken(token:string){
    sessionStorage.setItem(this.TOKEN,token);
  }
  getToken():string|null{
    console.log(sessionStorage.getItem(this.TOKEN));
    return sessionStorage.getItem(this.TOKEN);
  }
  removeToken():void{
    sessionStorage.removeItem(this.TOKEN);
  }
  isAuthenticated():boolean{
    return !!this.getToken();
  }
  constructor() { }
}
