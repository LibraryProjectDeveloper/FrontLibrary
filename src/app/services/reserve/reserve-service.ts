import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

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
  authorBook?: string;
  categoryBook?: string;
}

export interface ReserveRequest {
  userId?: number;
  libraryId?: number;
  bookId?: number;
  id?: number;
  startTime?: string;
  endTime?: string;
  reservationDate?: string;
  isActive?: boolean;
}
export interface ReserveResponse {
  dateReserve: string;
  timeStart: string;
  timeEnd: string;
  titleBook: string;
  userName: string;
  librarianName: string;
}
export interface ReserveReport {
  dateStart: string;
  dateEnd: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReserveService {
  private url = environment.apiUrl + '/reserve/';
  constructor(private http: HttpClient) {}
  getReserves() {
    return this.http.get<Reserve[]>(this.url);
  }
  getReservesReport(dateStart: string, dateEnd: string) {
    return this.http.get<ReserveResponse[]>(`${this.url}report`, {
      params: { dateStart, dateEnd },
    });
  }
  getReportExcel(reserveReport: ReserveReport): Observable<HttpResponse<Blob>> {
    return this.http.post<Blob>(`${this.url}download-report`, reserveReport, {
      responseType: 'blob' as 'json',
      observe: 'response',
    });
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

  searchReserveByUserCode(date: string, codeUser: number) {
    return this.http.get<Reserve[]>(
      `${this.url}searchDateByUser/${date}/user/${codeUser}`
    );
  }

  getRereserveByUserId(userId: number) {
    return this.http.get<Reserve[]>(`${this.url}user/${userId}`);
  }

  getSearchReserveBokkAuthor(search: string, idUser: number) {
    return this.http.get<Reserve[]>(
      `${this.url}searchReserveBookAut/${search}/${idUser}`
    );
  }

  searchReserveStateByUserId(state: boolean, userCode: number) {
    return this.http.get<Reserve[]>(
      `${this.url}searchByStateAndUser/${state}/user/${userCode}`
    );
  }
  addReserve(reserve: ReserveRequest) {
    return this.http.post<Reserve>(`${this.url}add`, reserve);
  }

  updateReserve(reserve: ReserveRequest) {
    return this.http.patch<Reserve>(`${this.url}update/${reserve.id}`, reserve);
  }

  deleteReserve(id: number) {
    return this.http.delete(`${this.url}delete/${id}`);
  }
}
