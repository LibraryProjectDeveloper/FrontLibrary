import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Loan } from '../../model/loan';
import { LoanRequest } from '../../model/LoanRequest';
import { environment } from '../../../environment/environment';
import {PageResponse} from '../../model/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class PrestSercice {
  private url = environment.apiUrl + '/loan';
  constructor(private http: HttpClient) {}

  getAllPrestamos() {
    return this.http.get<Loan[]>(this.url);
  }

  getAllLoans(page:number = 0, size:number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Loan>>(`${this.url}`,{ params });

  }

  getAllState(state: string) {
    return this.http.get<Loan[]>(`${this.url}/state/${state}`);
  }

  getAllByUserId(dni: string) {
    return this.http.get<Loan[]>(`${this.url}/user/dni/${dni}`);
  }

  getByUserId(id: number) {
    return this.http.get<Loan[]>(`${this.url}/user/${id}`);
  }

  getSearchDateByUserId(fecha: string, id: number) {
    return this.http.get<Loan[]>(`${this.url}/loanDate/${fecha}/${id}`);
  }

  serchLoanBookAuthorUser(query: string, idUser: number) {
    return this.http.get<Loan[]>(
      `${this.url}/searchBook/${idUser}?searchTerm=${query}`
    );
  }

  searchLoandByLoanDate(query: string) {
    return this.http.get<Loan[]>(`${this.url}/loansByDate/${query}`);
  }

  searchLoanSatateByUser(state: string, idUser: number) {
    return this.http.get<Loan[]>(`${this.url}/userByState/${state}/${idUser}`);
  }

  addLoan(loanRequest: LoanRequest) {
    return this.http.post<Loan>(`${this.url}/add`, loanRequest);
  }

  updateLoan(loanRequest: LoanRequest, id: number) {
    return this.http.put<Loan>(`${this.url}/update/${id}`, loanRequest);
  }
  finishedLoan(id_loan:number){
    return this.http.put<Loan>(`${this.url}/finished/${id_loan}`,{})
  }

  deleteLoan(id: number) {
    return this.http.delete(`${this.url}/delete/${id}`);
  }
}
