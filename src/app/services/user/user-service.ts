import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRequest } from '../../model/UserRequest';
import { map, Observable } from 'rxjs';

export interface User {
  idUsuario: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  dni: string;
  password: string;
  state: boolean;
  dateRegistered: string;
  roleName: string;
  idRol: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:8080/api/user/';
  constructor(private http: HttpClient) {}

  getUsersAll() {
    return this.http.get<User[]>(`${this.url}`);
  }

  getUsersInactives() {
    return this.http.get<User[]>(`${this.url}inactives`);
  }

  getUsersActives() {
    return this.http.get<User[]>(`${this.url}actives`);
  }

  getUserRol(dni: string, rol: string) {
    return this.http.get<User>(`${this.url}dniRol/${dni}/${rol}`);
  }

  getUser(id: number) {
    return this.http.get<User>(`${this.url}${id}`);
  }

  searchUser(search: string) {
    //para buscar por nombre, dni o email
    return this.http.get<any>(`${this.url}search/${search}`);
  }

  searchUserByRol(rol: number) {
    return this.http.get<User[]>(`${this.url}rol/${rol}`);
  }

  updateUser(User: UserRequest) {
    console.log('Updating user:', User);
    return this.http.patch<User>(`${this.url}update/${User.idUsuario}`, User);
  }

  addUser(User: UserRequest) {
    console.log('Adding user:', User);
    return this.http.post<User>(`${this.url}add`, User);
  }

  existeEmail(email: string): Observable<boolean> {
    return this.http
      .get<any>(`${this.url}existsEmail/${email}`)
      .pipe(map((response) => response.exists === true));
  }

  existeDni(dni: string): Observable<boolean> {
    return this.http
      .get<any>(`${this.url}existsDni/${dni}`)
      .pipe(map((response) => response.exists === true));
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.url}delete/${id}`);
  }
}
