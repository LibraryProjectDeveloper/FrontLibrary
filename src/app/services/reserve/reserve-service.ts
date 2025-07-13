import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Reserve {
  id:number,
  bookTitle:string,
  idUser:number,
  userName:string,
  librarianId:number,
  libraryName:string
  active:boolean,
  reservationDate:string,
  startTime:string,
  endTime:string
}
export interface ReserveResponse {
  dateReserve : string,
  timeStart : string,
  timeEnd : string,
  titleBook : string,
  userName : string,
  librarianName : string,
}
export interface ReserveReport{
  dateStart:string,
  dateEnd:string
}

@Injectable({
  providedIn: 'root'
})
export class ReserveService {
  private url = "http://localhost:8080/api/reserve/"
  constructor(private http: HttpClient) { }
  getReserves(){
    return this.http.get<Reserve[]>(this.url);
  }
  getReservesReport(dateStart:string,dateEnd:string){
    return this.http.get<ReserveResponse[]>(`${this.url}report`, { params :{ dateStart,dateEnd}});
  }
  getReportExcel(reserveReport:ReserveReport):Observable<HttpResponse<Blob>>{
    return this.http.post<Blob>(`${this.url}download-report`, reserveReport, { responseType: 'blob' as 'json',observe: 'response'
    });
  }
}
