import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Loan } from '../../model/loan';
import { LoanRequest } from '../../model/LoanRequest';
@Injectable({
  providedIn: 'root',
})
export class PrestSercice {
  private url = 'http://localhost:8080/api/loan';
  constructor(private http: HttpClient) {}

  getAllPrestamos() {
    return this.http.get<Loan[]>(this.url);
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

  addLoan(loanRequest: LoanRequest) {
    return this.http.post<Loan>(`${this.url}/add`, loanRequest);
  }

  updateLoan(loanRequest: LoanRequest, id: number) {
    return this.http.put<Loan>(`${this.url}/update/${id}`, loanRequest);
  }
}
