import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface User {
  idUsuario: number;
  name: string;
  lastname: string;
  email: string;
  phone : string;
  address: string;
  dni: string;
  state: boolean;
  dateRegistered: string;
  roleName: string;
  idRol:number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "http://localhost:8080/api/user/"
  constructor(private http: HttpClient) { }
  getUsers(){
    return this.http.get<User[]>(this.url)
  }

  getUserRol(dni:string,rol:string){
    return this.http.get<User>(`${this.url}dniRol/${dni}/${rol}`);
  }

  getUser(id:number){
    return this.http.get<User>(`${this.url}${id}`)
  }
}
