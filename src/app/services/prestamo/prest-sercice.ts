import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Loan} from '../../model/loan';
@Injectable({
  providedIn: 'root'
})
export class PrestSercice {
  private url= 'http://localhost:8080/api/loan';
  constructor(private http: HttpClient) { }

  getAllPrestamos(){
    return this.http.get<Loan[]>(this.url);
  }

  getAllState(state:string){
    return this.http.get<Loan[]>(`${this.url}/state/${state}`);
  }
}
