import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserRequest } from '../../model/UserRequest';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { PageResponse } from '../../model/PageResponse';

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
  private url = environment.apiUrl + '/user/';
  constructor(private http: HttpClient) {}

  getUsersAll() {
    return this.http.get<User[]>(`${this.url}`);
  }

  getUsersInactives(page: number = 0, size: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<User>>(`${this.url}inactives`, {
      params,
    });
  }

  getUsersActives(page: number = 0, size: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<User>>(`${this.url}actives`, { params });
  }

  getUserRol(dni: string, rol: string) {
    return this.http.get<User>(`${this.url}dniRol/${dni}/${rol}`);
  }

  getUser(id: number) {
    return this.http.get<User>(`${this.url}${id}`);
  }

  searchUser(search: string, page: number = 0, size: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    //para buscar por nombre, dni o email
    return this.http.get<PageResponse<User>>(`${this.url}search/${search}`, {
      params,
    });
  }

  searchUserByRol(rol: number, page: number = 0, size: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<User>>(`${this.url}rol/${rol}`, {
      params,
    });
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
