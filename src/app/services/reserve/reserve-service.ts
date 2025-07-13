import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Reserve {
  id: number;
  bookTitle: string;
  idUser: number;
  userName: string;
  librarianId: number;
  libraryName: string;
  active: boolean;
  reservationDate: string;
  startTime: string;
  endTime: string;
}

export interface ReserveRequest {
  userId?: number;
  libraryId?: number;
  bookId?: number;
  id?: number;

  BookId?: number;
  startTime?: string;
  endTime?: string;
  reservationDate?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReserveService {
  private url = 'http://localhost:8080/api/reserve/';
  constructor(private http: HttpClient) {}
  getReserves() {
    return this.http.get<Reserve[]>(this.url);
  }

  getReserveActives() {
    return this.http.get<Reserve[]>(`${this.url}actives`);
  }

  getReserveInactives() {
    return this.http.get<Reserve[]>(`${this.url}inactives`);
  }

  getReserveByDnI(dni: string) {
    return this.http.get<Reserve[]>(`${this.url}user/dni/${dni}`);
  }

  getRereserveByTitle(title: string) {
    return this.http.get<Reserve[]>(`${this.url}book/${title}`);
  }

  getReserveByDate(date: string) {
    return this.http.get<Reserve[]>(`${this.url}date/${date}`);
  }

  addReserve(reserve: ReserveRequest) {
    return this.http.post<Reserve>(`${this.url}add`, reserve);
  }

  updateReserve(reserve: ReserveRequest) {
    return this.http.put<Reserve>(`${this.url}update/${reserve.id}`, reserve);
  }

  deleteReserve(id: number) {
    return this.http.delete(`${this.url}delete/${id}`);
  }
}
