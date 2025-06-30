import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

@Injectable({
  providedIn: 'root'
})
export class ReserveService {
  private url = "http://localhost:8080/api/reserve/"
  constructor(private http: HttpClient) { }
  getReserves(){
    return this.http.get<Reserve[]>(this.url);
  }
}
