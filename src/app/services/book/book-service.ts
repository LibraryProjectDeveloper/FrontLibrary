import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Book {
  codeBook: string;
  title: string;
  isbn: string;
  publicationDate: string;
  publisher:string;
  category: string;
  stockTotal: number;
  state: string;
}


@Injectable({
  providedIn: 'root'
})
export class BookService {
  private url = 'http://localhost:8080/api/LIBRARIAN/books';
  constructor(private http:HttpClient) { }
  getBooks(){
    return this.http.get<Book[]>(this.url);
  }
}
