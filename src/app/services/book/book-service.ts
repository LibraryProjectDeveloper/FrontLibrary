import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthorModel} from '../../model/Author';

export interface Book {
  codeBook: number;
  title: string;
  isbn: string;
  publicationDate: string;
  publisher:string;
  category: string;
  stockTotal: number;
  state: string;
  author: AuthorModel[];
}

export interface BookResponse {
  codeBook: number;
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
    return this.http.get<Book[]>(this.url+'/state/ACTIVO');
  }

  getBookCategory(category:string):Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/categoria/${category}`);
  }

  getBookState(state:string):Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/state/${state}`);
  }

  getBookYear(year:number):Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/year/${year}`);
  }

  addBook(book:Book){
    return this.http.post<Book>(`${this.url}/add`,book);
  }

  putBook(book:Book,id:number){
    return this.http.put<Book>(`${this.url}/update/${id}`,book);
  }
  getBuscarTitle(title:string):Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/searchTitle?title=${title}`);
  }

  getBuscarCategory(category:string):Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/searchCategory?category=${category}`);
  }
  deleteBook(id:number) {
    return this.http.delete<Book>(`${this.url}/delete/${id}`);
  }
}
